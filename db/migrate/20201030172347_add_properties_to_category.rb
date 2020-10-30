class AddPropertiesToCategory < ActiveRecord::Migration[6.0]
  def change
    add_column :categories, :properties, :jsonb, default: []
  end
end
