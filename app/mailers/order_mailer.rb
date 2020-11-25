class OrderMailer < ApplicationMailer
  before_action :add_inline_attachment!

  def order_confirmation
    @order = params[:order]
    @user = @order.user

    @order.order_items.each do |item|
      product = item.product
      picture = product.pictures.first

      attachments.inline[picture.blob.filename.to_s] = {
        mime_type: picture.blob.content_type,
        download: picture.blob.download
      }
    end

    mail(to: @user.email, subject: "¡Gracias por tu compra en Gamer Central! ##{@order.uid}")
  end


  private

  def add_inline_attachment!
    attachments.inline['logo.png'] = File.read(File.join(Rails.root, 'app', 'assets', 'images', 'logo.png'))
  end
end
