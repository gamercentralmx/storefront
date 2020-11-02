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
  has_many :payment_methods, dependent: :destroy

  def name
    first_name.present? ? first_name : email.split('@')[0]
  end

  def full_name
    "#{name} #{last_name}"
  end

  def method_missing(method_name, *arguments, &block)
    if method_name.to_s =~ /is_(\w*)\?/
      has_role? Regexp.last_match(1)
    else
      super
    end
  end

  def respond_to_missing?(method_name, include_private = false)
    method_name.to_s.start_with?('is_') || super
  end

  def setup_stripe_customer
    return if stripe_customer_setup?

    customer = Stripe::Customer.create(
      name: full_name,
      email: email
    )

    update(stripe_id: customer.id)
  end

  def stripe_customer_setup?
    stripe_id.present?
  end

  def stripe_customer
    @stripe_customer ||= stripe_customer_setup? ? Stripe::Customer.retrieve(stripe_id) : nil
  end
end
