export interface OrderItemData {
  qty: number
  product_id: number
}

export interface OrderData {
  user_id?: number
  order_items_attributes: OrderItemData[]
}

export default class OrdersRepository {
  static async save (order: OrderData) {
    return $.ajax({ url: '/admin/orders', method: 'POST', data: { order } })
  }
}
