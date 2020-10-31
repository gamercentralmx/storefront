class Product < ApplicationRecord
  belongs_to :category
  has_many :order_items, dependent: :destroy

  delegate :name, to: :category, prefix: 'category'

  def specs
    metadata.map { |_, description| description }
  end
end
