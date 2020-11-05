class AddPaymentIntentToOrders < ActiveRecord::Migration[6.0]
  def change
    add_reference :orders, :payment_intent, foreign_key: true, index: true
    add_reference :orders, :invoice_info, foreign_key: { to_table: 'addresses' }, index: true
  end
end
