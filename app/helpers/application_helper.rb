module ApplicationHelper
  def alert_helper(text:, intent: 'primary')
    tag.div(class: "alert alert-#{intent}", role: 'alert') do
      tag.div(class: 'container') do
        content = tag.span text.html_safe

        content += tag.button(type: 'button', class: 'close', 'data-dismiss' => 'alert', 'aria-label' => 'close') do
          tag.span('&times;'.html_safe, 'aria-hidden' => true)
        end

        content
      end
    end
  end
end
