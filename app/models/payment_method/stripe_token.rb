class PaymentMethod::StripeToken
  attr_reader :user, :token, :token_object, :errors, :payment_method

  def initialize(user, params)
    @user = user
    @token = params[:token]
    @errors = []
  end

  def process!
    ActiveRecord::Base.transaction do
      user.setup_stripe_customer

      add_stripe_source!

      store_payment_method!
    rescue Stripe::StripeError => e
      self.errors << e.message

      raise ActiveRecord::Rollback
    end
  end

  def add_stripe_source!
    Stripe::Customer.create_source(user.stripe_id, source: token[:id])
  end

  def store_payment_method!
    @payment_method = user.payment_methods.create!(
      kind: token[:type],
      stripe_id: source.id,
      metadata: source.to_h
    )

    @payment_method.make_default!
  end

  def source
    @source ||= Stripe::Customer.retrieve_source(user.stripe_id, token[:card][:id])
  end

  def success?
    errors.empty?
  end
end
