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
    @payment_intent = PaymentIntent.new(payment_intent_params)

    if @payment_intent.save
      render json: @payment_intent
    else
      render json: { errors: @payment_intent.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    @payment_intent = PaymentIntent.find(params[:id])

    if @payment_intent.save(payment_intent_params)
      render json: @payment_intent
    else
      render json: { errors: @payment_intent.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def payment_intent_params
    params.require(:payment_method).permit(:user_id, :payment_method_id, :amount, :idempotency_key, :status)
  end
end
