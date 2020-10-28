class CreateOrders < ActiveRecord::Migration[6.0]
  def change
    create_table :orders do |t|
      t.references :user, null: false, foreign_key: true, index: true
      t.references :address, null: false, foreign_key: true, index: true

      t.timestamps
    end
  end
end
