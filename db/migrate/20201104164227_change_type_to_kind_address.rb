class ChangeTypeToKindAddress < ActiveRecord::Migration[6.0]
  def change
    rename_column :addresses, :type, :kind
  end
end
