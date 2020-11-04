class AddressesController < ApplicationController
  before_action :authenticate_user!

  def index
    @addresses = current_user.addresses
  end

  def new
    @address = current_user.addresses.new
  end
end
