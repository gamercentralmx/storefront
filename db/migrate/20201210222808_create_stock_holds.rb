class CreateStockHolds < ActiveRecord::Migration[6.0]
  def change
    create_table :stock_holds do |t|
      t.references :product, foreign_key: true
      t.integer :qty, default: 0
      t.references :order, foreign_key: true
      t.references :order_item, foreign_key: true
      t.datetime :expires_in
      t.datetime :confirmed_at

      t.timestamps
    end
  end
end
