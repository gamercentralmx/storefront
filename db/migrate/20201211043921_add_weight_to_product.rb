class AddWeightToProduct < ActiveRecord::Migration[6.0]
  def change
    add_column :products, :weight, :integer
  end
end
