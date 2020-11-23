class Product < ApplicationRecord
  belongs_to :category
  has_many :order_items, dependent: :destroy

  delegate :name, to: :category, prefix: 'category'

  has_many_attached :pictures

  include Rails.application.routes.url_helpers

  def specs
    (metadata || []).map { |_, description| description }
  end

  def price_in_currency
    price.to_f / 100
  end

  def cost_in_currency
    cost.to_f / 100
  end

  def attach_pictures(pictures_data)
    pics = pictures_data.values.map do |upload|
      ActiveStorage::Blob.create_after_upload!(filename: upload[:filename], io: upload[:io])
    end

    update(pictures: pics)
  end

  def serialize
    {
      name: name,
      price: price,
      metadata: metadata,
      description: description,
      category_name: category_name,
      pictures: pictures.map { |p| rails_blob_path(p, only_path: true) }
    }
  end
end
