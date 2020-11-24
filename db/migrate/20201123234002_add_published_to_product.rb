class AddPublishedToProduct < ActiveRecord::Migration[6.0]
  def change
    add_column :products, :published, :boolean, default: false, index: true
  end
end
