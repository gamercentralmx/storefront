class Order < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :address, optional: true
  belongs_to :payment_method, optional: true
  belongs_to :payment_intent, optional: true
  belongs_to :invoice_info, class_name: 'Address', optional: true
  has_many :order_items, dependent: :destroy

  accepts_nested_attributes_for :order_items

  audited

  enum status: {
    pending: 'pending',
    paid: 'paid',
    processing: 'processing',
    shipped: 'shipped',
    complete: 'complete',
    canceled: 'canceled'
  }

  STATUS_INTENTS = {
    'pending' => 'secondary',
    'paid' => 'primary',
    'processing' => 'warning',
    'shipped' => 'info',
    'complete' => 'success',
    'canceled' => 'danger'
  }.freeze

  STATUS_TRANSLATIONS = {
    'pending' => 'Pendiente',
    'paid' => 'Pagado',
    'processing' => 'En proceso',
    'shipped' => 'Enviado',
    'complete' => 'Completo',
    'canceled' => 'Cancelado'
  }.freeze

  before_create :set_uid

  scope :not_pending, -> { where('status != ?', 'pending') }
  scope :created_desc, -> { order(created_at: :desc) }

  def self.current
    where(status: 'pending').first_or_create
  end

  def products_total
    order_items.map(&:total).sum
  end

  def total
    products_total + shipping_cost
  end

  def products_total_in_currency
    products_total.to_f / 100
  end

  def total_in_currency
    total.to_f / 100
  end

  def shipping_cost_in_currency
    shipping_cost.to_f / 100
  end

  def formatted_order_date
    (ordered_at || created_at).strftime('%d/%m/%Y')
  end

  def total_items
    order_items.sum(:qty)
  end

  def serialize
    {
      id: uid,
      status: status,
      created_at: created_at,
      updated_at: updated_at,
      total_in_currency: total_in_currency,
      order_items: order_items.map(&:serialize),
      shipping_cost_in_currency: shipping_cost_in_currency,
      products_total_in_currency: products_total_in_currency
    }
  end

  def transition_to_paid!
    update(ordered_at: Time.current)

    order_items.map(&:confirm!)

    send_order_confirmation!
  end

  def send_order_confirmation!
    OrderMailer.with(order: self).order_confirmation.deliver_now
  end

  def calculate_shipping!
    shipping = Order::Shipping.new(self)

    shipping.calculate!

    update(shipping_cost: shipping.cost)
  end

  private

  def set_uid
    self.uid = SecureRandom.alphanumeric(6).upcase
  end
end
