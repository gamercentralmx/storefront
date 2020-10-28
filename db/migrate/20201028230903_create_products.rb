class CreateProducts < ActiveRecord::Migration[6.0]
  def change
    create_table :products do |t|
      t.references :category, null: false, foreign_key: true, index: true
      t.string :name
      t.string :description
      t.jsonb :metadata
      t.integer :cost
      t.integer :price
      t.integer :stock

      t.timestamps
    end
  end
end
