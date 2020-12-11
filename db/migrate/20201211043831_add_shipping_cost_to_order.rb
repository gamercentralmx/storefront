class AddShippingCostToOrder < ActiveRecord::Migration[6.0]
  def change
    add_column :orders, :shipping_cost, :integer, default: 0
  end
end
