module SlugBehavior
  extend ActiveSupport::Concern

  included do
    before_create :set_slug
  end

  def set_slug
    self.slug = name.parameterize
  end
end
