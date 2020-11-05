class PaymentIntentsController < ApplicationController
  before_action :authenticate_user!

  def index
    @payment_intents = current_user.payment_intents

    respond_to do |format|
      format.html
      format.json { render json: @payment_intents }
    end
  end

  def create
    @payment_intent = PaymentIntent.find_or_create_by(
      user_id: current_user.id,
      payment_method_id: payment_intent_params[:payment_method_id],
      amount: payment_intent_params[:amount],
      idempotency_key: payment_intent_params[:idempotency_key],
    )

    if @payment_intent.errors.blank?
      render json: @payment_intent
    else
      render json: { errors: @payment_intent.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def confirm
    @payment_intent = current_user.payment_intents.find(params[:id])
    charge = PaymentIntent::Confirm.new(@payment_intent, payment_intent_params)

    charge.process!

    if charge.success?
      render json: { status: @payment_intent.status }
    else
      render json: { errors: charge.errors }, status: :unprocessable_entity
    end
  end

  private

  def payment_intent_params
    params.require(:payment_intent).permit(
      :payment_method_id,
      :amount,
      :idempotency_key,
      selected_plan: %i[count interval type]
    )
  end
end
