class AddStripeIdToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :stripe_id, :string, index: true
  end
end
