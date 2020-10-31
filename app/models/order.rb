class Order < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :address, optional: true
  has_many :order_items, dependent: :destroy

  accepts_nested_attributes_for :order_items

  enum :status, {
    pending: 'pending',
    processing: 'processing',
    shipped: 'shipped',
    complete: 'complete'
  }

  def total
    order_items.map(&:total).sum
  end
end
