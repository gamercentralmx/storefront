class CreateAuthProviders < ActiveRecord::Migration[6.0]
  def change
    create_table :auth_providers do |t|
      t.references :user, null: false, foreign_key: true, index: true
      t.string :provider
      t.string :uid
      t.jsonb :auth

      t.timestamps
    end
  end
end
