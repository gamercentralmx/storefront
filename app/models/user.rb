class User < ApplicationRecord
  rolify
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :confirmable, :trackable,
         :omniauthable, omniauth_providers: %i[facebook google_oauth2]

  has_many :auth_providers, dependent: :nullify
  has_many :addresses, dependent: :destroy
  has_many :orders, dependent: :nullify
  has_many :invoice_infos, dependent: :nullify

  def name
    first_name.present? ? first_name : email.split('@')[0]
  end
end
