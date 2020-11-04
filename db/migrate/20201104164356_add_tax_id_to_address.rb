class AddTaxIdToAddress < ActiveRecord::Migration[6.0]
  def change
    add_column :addresses, :name, :string
    add_column :addresses, :tax_id, :string
    add_column :addresses, :business_name, :string
    add_column :addresses, :business_type, :string
  end
end
