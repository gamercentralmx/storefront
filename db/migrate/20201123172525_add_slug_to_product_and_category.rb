class AddSlugToProductAndCategory < ActiveRecord::Migration[6.0]
  def change
    add_column :products, :slug, :string, index: true
    add_column :categories, :slug, :string, index: true
  end
end
