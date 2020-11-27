module SlugBehavior
  extend ActiveSupport::Concern

  included do
    before_save :set_slug, if: :name_changed?
  end

  def set_slug
    self.slug = name.parameterize
  end
end
