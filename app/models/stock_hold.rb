class StockHold < ApplicationRecord
  belongs_to :product
  belongs_to :order
  belongs_to :order_item

  scope :fresh, -> { where('expires_at > ?', Time.current) }
  scope :on_hold_for, ->(product_id) { fresh.where(product_id: product_id, confirmed_at: nil) }

  before_create :set_expiration

  def self.find_or_create(opts)
    fresh.where(opts).first_or_create
  end

  def self.amount_on_hold_for(product_id)
    on_hold_for(product_id).sum(:qty)
  end

  def expired?
    expires_at < Time.current || confirmed_at.present?
  end

  private

  def set_expiration
    self.expires_at = 10.minutes.from_now
  end
end
