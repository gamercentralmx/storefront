class AddressesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_address!, only: [:edit, :update, :destroy]

  def index
    @addresses = current_user.addresses

    @addresses = @addresses.where('(tax_id = \'\') IS FALSE') if params[:type] == 'invoice'

    respond_to do |format|
      format.html
      format.json { render json: @addresses }
    end
  end

  def new
    @address = current_user.addresses.new
  end

  def create
    @address = current_user.addresses.new(address_params)

    respond_to do |format|
      if @address.save
        format.html { redirect_to addresses_path, notice: 'Dirección registrada con éxito.' }
        format.json { render json: @address, status: :created }
      else
        format.html do
          flash[:alert] = 'Se produjo un error al guardar esta dirección.'
          render :new, status: :unprocessable_entity
        end
        format.json { render json: { errors: @address.errors.full_messages }, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @address.update(address_params)
        format.html { redirect_to addresses_path, notice: 'Dirección actualizada con éxito.' }
        format.json { render json: @address }
      else
        format.html do
          flash[:alert] = 'Se produjo un error al guardar esta dirección.'
          render :edit
        end
        format.json { render json: { errors: @address.errors.full_messages }, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @address.destroy

    redirect_to addresses_path, notice: 'La dirección fue eliminada exitosamente.'
  end

  private

  def set_address!
    @address = current_user.addresses.find(params[:id])
  end

  def address_params
    params.require(:address).permit(
      :street,
      :neighborhood,
      :city,
      :state,
      :zip_code,
      :country,
      :name,
      :tax_id,
      :business_name,
      :business_type
    )
  end
end
