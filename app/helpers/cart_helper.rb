module CartHelper
  def shopping_cart
    tag.div class: 'widget-header mr-3' do
      content = ''

      content += link_to(cart_index_path, class: 'icon icon-sm border rounded-circle') do
        tag.i class: 'fa fa-shopping-cart'
      end

      content += tag.span(current_order&.total_items || 0, class: 'badge badge-pill badge-danger notify')

      content.html_safe
    end
  end
end
