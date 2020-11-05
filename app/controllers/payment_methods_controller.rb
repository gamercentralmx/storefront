class PaymentMethodsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_payment_method!, only: [:destroy, :make_default, :installments]

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

  def destroy
    @payment_method.destroy

    current_user.payment_methods.first.make_default! if current_user.default_source == @payment_method.stripe_id && current_user.payment_methods.any?

    redirect_to payment_methods_path, notice: "La tarjeta terminación #{@payment_method.metadata['last4']} ha sido eliminada."
  end

  def make_default
    @payment_method.make_default!

    respond_to do |format|
      format.html { redirect_to payment_methods_path, notice: "La tarjeta terminación #{@payment_method.metadata['last4']} ha sido marcada como principal." }
      format.json { render json: @payment_method }
    end
  end

  private

  def set_payment_method!
    @payment_method = current_user.payment_methods.find(params[:id])
  end

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

  def payment_intent_params
    params.require(:payment_intent).permit(:id, selected_plan: %i[count interval type])
  end
end
