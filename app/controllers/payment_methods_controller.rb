class PaymentMethodsController < ApplicationController
  before_action :authenticate_user!

  def index
    @payment_methods = current_user.payment_methods

    respond_to do |format|
      format.html
      format.json { render json: @payment_methods }
    end
  end

  def create
    stripe_token = PaymentMethod::StripeToken.new(current_user, token_params)

    stripe_token.process!

    if stripe_token.success?
      render json: stripe_token.payment_method, status: :created
    else
      render json: stripe_token.errors, status: :unprocessable_entity
    end
  end

  def make_default
    @payment_method = current_user.payment_methods.find(params[:id])

    @payment_method.make_default!

    render json: @payment_method
  end

  private

  def token_params
    params.require(:payment_method).permit(
      token: [
        :id,
        :object,
        :client_ip,
        :created,
        :livemode,
        :type,
        :used,
        card: [
          :id,
          :object,
          :address_city,
          :address_country,
          :address_line1,
          :address_line1_check,
          :address_line2,
          :address_state,
          :address_zip,
          :address_zip_check,
          :brand,
          :country,
          :cvc_check,
          :dynamic_last4,
          :exp_month,
          :exp_year,
          :funding,
          :last4,
          :name,
          :tokenization_method
        ]
      ]
    )
  end
end
