class PaymentMethod::Charge
  attr_reader :user, :payment_method, :params, :errors

  def initialize(user, payment_method, params)
    @user = user
    @params = params
    @payment_method = payment_method
    @errors = []
  end

  def process!
    data = {}

    add_installments! data if params[:selected_plan].present?

    confirm_payment_intent!
  rescue Stripe::CardError => e
    errors << e.message

    false
  end

  def add_installments! data
    data[:payment_method_options] = {
      card: {
        installments: {
          plan: params[:selected_plan],
        }
      }
    }
  end

  def confirm_payment_intent!å
    Stripe::PaymentIntent.confirm(params[:id], data)
  end

  def success?
    errors.empty?
  end
end
