class Product < ApplicationRecord
  belongs_to :category
  has_many :order_items, dependent: :destroy

  def specs
    metadata.map { |_, description| description }
  end
end
