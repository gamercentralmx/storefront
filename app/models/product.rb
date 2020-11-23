class Product < ApplicationRecord
  belongs_to :category
  has_many :order_items, dependent: :destroy

  delegate :name, to: :category, prefix: 'category'

  has_many_attached :pictures

  def specs
    (metadata || []).map { |_, description| description }
  end

  def price_in_currency
    price.to_f / 100
  end

  def cost_in_currency
    cost.to_f / 100
  end

  def serialize
    {
      name: name,
      price: price,
      metadata: metadata,
      description: description,
      category_name: category_name
    }
  end
end
