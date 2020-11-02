class RemoveNullConstraintsForOrders < ActiveRecord::Migration[6.0]
  def change
    remove_reference :orders, :user
    remove_reference :orders, :address

    add_reference :orders, :user, foreign_key: true, index: true
    add_reference :orders, :address, foreign_key: true, index: true
  end
end
