class AddPaymentMethodToOrder < ActiveRecord::Migration[6.0]
  def change
    add_reference :orders, :payment_method, foreign_key: true, index: true
  end
end
