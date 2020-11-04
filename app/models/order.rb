class Order < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :address, optional: true
  belongs_to :payment_method
  has_many :order_items, dependent: :destroy

  accepts_nested_attributes_for :order_items

  enum status: {
    pending: 'pending',
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

  def total
    order_items.map(&:total).sum
  end

  def total_in_currency
    total.to_f / 100
  end

  private

  def set_uid
    self.uid = SecureRandom.alphanumeric(10)
  end
end
