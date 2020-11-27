class AddFeaturedToProduct < ActiveRecord::Migration[6.0]
  def change
    add_column :products, :featured, :boolean, default: false, index: true
  end
end
