class PaymentIntent::Confirm
  attr_reader :user, :params, :errors, :payment_intent

  def initialize(payment_intent, params)
    @user = payment_intent.user
    @params = params
    @errors = []
    @payment_intent = payment_intent
  end

  def process!
    data = {}

    add_installments! data if selected_plan.present? and selected_plan[:count].to_i.positive?

    confirm_payment_intent! data
  rescue Stripe::CardError => e
    errors << e.message

    false
  end

  def add_installments! data
    data[:payment_method_options] = {
      card: {
        installments: {
          plan: params[:selected_plan].to_unsafe_h
        }
      }
    }
  end

  def confirm_payment_intent! data
    stripe_intent = Stripe::PaymentIntent.confirm(payment_intent.stripe_id, data)

    payment_intent.payment_method_options = stripe_intent.payment_method_options
    payment_intent.status = stripe_intent.status

    payment_intent.save
  end

  def selected_plan
    @selected_plan ||= params[:selected_plan]
  end

  def success?
    errors.empty?
  end
end
