class AddressesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_address!, only: [:edit, :update, :destroy]

  def index
    @addresses = current_user.addresses
  end

  def new
    @address = current_user.addresses.new
  end

  def create
    @address = current_user.addresses.new(address_params)

    if @address.save
      redirect_to addresses_path, notice: 'Dirección registrada con éxito.'
    else
      flash[:alert] = 'Se produjo un error al guardar esta dirección.'
      render :new
    end
  end

  def update
    if @address.update(address_params)
      redirect_to addresses_path, notice: 'Dirección actualizada con éxito.'
    else
      flash[:alert] = 'Se produjo un error al guardar esta dirección.'
      render :new
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
