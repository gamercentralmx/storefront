class Product::Related
  attr_reader :product

  TOTAL = 5

  def initialize(product)
    @product = product
  end

  def products
    products = from_category

    products << from_published[0...(TOTAL - products.count)] if products.count < TOTAL

    products.flatten
  end

  private

  def from_category
    published.where(category_id: product.category_id).sample(5)
  end

  def from_published
    published.sample(5)
  end

  def published
    Product.published.where('id != ?', product.id).includes(:category)
  end
end
