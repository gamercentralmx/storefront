class Product < ApplicationRecord
  belongs_to :category
  has_many :order_items, dependent: :destroy

  delegate :name, to: :category, prefix: 'category'

  def specs
    metadata.map { |_, description| description }
  end

  def price_in_currency
    price.to_f / 100
  end

  def cost_in_currency
    cost.to_f / 100
  end
end
