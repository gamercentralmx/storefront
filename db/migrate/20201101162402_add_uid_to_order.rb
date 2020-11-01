class AddUidToOrder < ActiveRecord::Migration[6.0]
  def change
    add_column :orders, :uid, :string, index: true
  end
end
