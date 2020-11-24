class Order < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :address, optional: true
  belongs_to :payment_method, optional: true
  belongs_to :payment_intent, optional: true
  belongs_to :invoice_info, class_name: 'Address', optional: true
  has_many :order_items, dependent: :destroy

  accepts_nested_attributes_for :order_items

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
    'processing' => 'info',
    'shipped' => 'primary',
    'complete' => 'success',
    'canceled' => 'danger'
  }

  STATUS_TRANSLATIONS = {
    'pending' => 'Pendiente',
    'processing' => 'En proceso',
    'shipped' => 'Enviado',
    'complete' => 'Completo',
    'canceled' => 'Cancelado'
  }

  before_create :set_uid

  def self.current
    where(status: 'pending').first_or_create
  end

  def total
    order_items.map(&:total).sum
  end

  def total_in_currency
    total.to_f / 100
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
      order_items: order_items.map(&:serialize)
    }
  end

  private

  def set_uid
    self.uid = SecureRandom.alphanumeric(10)
  end
end
