class PaymentMethod::Charge
  attr_reader :user, :payment_method, :params, :errors, :payment_intent

  def initialize(user, payment_method, params)
    @user = user
    @params = params
    @payment_method = payment_method
    @errors = []
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
    @payment_intent = Stripe::PaymentIntent.confirm(params[:id], data)
  end

  def selected_plan
    @selected_plan ||= params[:selected_plan]
  end

  def success?
    errors.empty?
  end
end
