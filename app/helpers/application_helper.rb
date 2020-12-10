module ApplicationHelper
  def alert_helper(text:, intent: 'primary')
    tag.div(class: "alert alert-#{intent}", role: 'alert', style: 'margin-bottom: 0; border-radius: 0') do
      tag.div(class: 'container') do
        content = tag.button(type: 'button', class: 'close', 'data-dismiss' => 'alert', 'aria-label' => 'close') do
          tag.span('&times;'.html_safe, 'aria-hidden' => true)
        end

        content += tag.span text.html_safe

        content
      end
    end
  end

  def admin_alert_helper(text:, intent: 'primary')
    tag.div(class: "alert alert-#{intent}", role: 'alert') do
      content = tag.button(type: 'button', class: 'close', 'data-dismiss' => 'alert', 'aria-label' => 'close') do
        tag.span('&times;'.html_safe, 'aria-hidden' => true)
      end

      content += tag.span text.html_safe

      content
    end
  end

  def user_display_string(user)
    return 'No asignado' if user.nil?

    "#{user.id}. #{user.full_name} - #{user.email}"
  end

  def product_image_tag(product, options = {})
    picture = product.pictures.any? ? rails_blob_path(product.pictures.first) : 'gunslinger.jpg'

    image_tag(picture, options)
  end
end
