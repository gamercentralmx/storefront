class AddOrderDateToOrders < ActiveRecord::Migration[6.0]
  def change
    add_column :orders, :ordered_at, :datetime
  end
end
