class CreatePaymentIntents < ActiveRecord::Migration[6.0]
  def change
    create_table :payment_intents do |t|
      t.references :payment_method, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.integer :amount
      t.integer :amount_received
      t.integer :idempotency_key
      t.string :status
      t.jsonb :payment_method_options
      t.string :stripe_id

      t.timestamps
    end
  end
end
