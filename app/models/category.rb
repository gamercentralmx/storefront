class Category < ApplicationRecord
  has_many :products, dependent: :nullify
  belongs_to :parent, class_name: 'Category', optional: true
  has_many :sub_categories, class_name: 'Category', foreign_key: 'parent_id'

  scope :main, -> { where(parent_id: nil) }
  scope :visible, -> { where(visible: true) }
  scope :by_order, -> { order(order: :asc) }

  include SlugBehavior

  before_save :process_properties

  def property_names
    properties.map { |property| property['name'] }
  end

  private

  def process_properties
    self.properties = properties.map { |_k, v| v } if properties.is_a? Hash
  end
end
