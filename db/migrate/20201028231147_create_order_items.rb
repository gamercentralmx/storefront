class CreateOrderItems < ActiveRecord::Migration[6.0]
  def change
    create_table :order_items do |t|
      t.references :product, null: false, foreign_key: true, index: true
      t.references :order, null: false, foreign_key: true, index: true
      t.integer :qty

      t.timestamps
    end
  end
end
