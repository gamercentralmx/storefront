class AddVisibleToCategory < ActiveRecord::Migration[6.0]
  def change
    add_column :categories, :visible, :boolean, default: false, index: true
  end
end
