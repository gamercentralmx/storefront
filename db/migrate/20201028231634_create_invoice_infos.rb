class CreateInvoiceInfos < ActiveRecord::Migration[6.0]
  def change
    create_table :invoice_infos do |t|
      t.references :user, null: false, foreign_key: true, index: true
      t.string :name
      t.string :tax_id
      t.references :address, null: false, foreign_key: true, index: true

      t.timestamps
    end
  end
end
