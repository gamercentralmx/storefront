class AddDefaultSourceToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :default_source, :string
  end
end
