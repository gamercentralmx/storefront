class CreatePaymentMethods < ActiveRecord::Migration[6.0]
  def change
    create_table :payment_methods do |t|
      t.references :user, null: false, foreign_key: true, index: true
      t.string :stripe_id
      t.string :kind
      t.jsonb :metadata

      t.timestamps
    end
  end
end
