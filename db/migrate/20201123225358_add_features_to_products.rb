class AddFeaturesToProducts < ActiveRecord::Migration[6.0]
  def change
    add_column :products, :features, :jsonb, default: []
  end
end
