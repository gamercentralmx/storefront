class CreateAddresses < ActiveRecord::Migration[6.0]
  def change
    create_table :addresses do |t|
      t.references :user, null: false, foreign_key: true, index: true
      t.string :street
      t.string :neighborhood
      t.string :city
      t.string :state
      t.string :zip_code
      t.string :country
      t.string :type, default: 'both'

      t.timestamps
    end
  end
end
