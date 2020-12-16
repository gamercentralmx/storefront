class Product < ApplicationRecord
  belongs_to :category
  has_many :order_items, dependent: :destroy

  scope :published, -> { where(published: true) }
  scope :featured, -> { published.where(featured: true).order(price: :asc) }
  scope :search, ->(term) { where('name ILIKE ?', "%#{term}%") }

  audited

  include SlugBehavior

  delegate :name, :slug, to: :category, prefix: 'category'

  has_many_attached :pictures
  has_one_attached :cover_picture

  before_save :parse_features

  include Rails.application.routes.url_helpers

  SORTINGS = {
    'Nombre A-Z' => { name: :asc },
    'Nombre Z-A' => { name: :desc },
    'Menor Precio' => { price: :asc },
    'Mayor Precio' => { price: :desc },
    'Mas nuevos' => { created_at: :desc }
  }

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

  def attach_cover_picture(upload)
    attachment = ActiveStorage::Blob.create_after_upload!(filename: upload[:filename], io: upload[:io])

    update(cover_picture: attachment)
  end

  def publish!
    update(published: true)
  end

  def unpublish!
    update(published: false)
  end

  def serialize
    {
      name: name,
      price: price,
      metadata: metadata,
      description: description,
      category_name: category_name,
      pictures: pictures.map { |p| rails_blob_path(p, only_path: true) },
      cover_picture: cover_picture.present? ? rails_blob_path(cover_picture, only_path: true) : nil
    }
  end

  def stock
    amount = read_attribute(:stock) || 0
    on_hold = StockHold.amount_on_hold_for(id) || 0

    amount - on_hold
  end

  def as_json(opts = {})
    super(opts).merge(
      pictures: pictures.map { |p| p.as_json.merge(url: rails_blob_path(p, only_path: true)) }
    )
  end

  private

  def parse_features
    self.features = features.values if features.is_a? Hash
  end
end
