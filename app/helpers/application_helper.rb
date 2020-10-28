module ApplicationHelper
  def alert_helper(text:, intent: 'primary')
    tag.div(class: "alert alert-#{intent}", role: 'alert') do
      tag.span text.html_safe

      tag.button(type: 'button', class: 'close', 'data-dismiss' => 'alert', 'aria-label' => 'close') do
        tag.span('&times;'.html_safe, 'aria-hidden' => true)
      end
    end
  end
end
