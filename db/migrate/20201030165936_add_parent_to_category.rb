class AddParentToCategory < ActiveRecord::Migration[6.0]
  def change
    add_reference :categories, :parent, foreign_key: { to_table: 'categories' }, index: true
  end
end
