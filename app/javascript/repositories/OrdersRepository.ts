export interface OrderItemData {
  qty: number
  product_id: number
}

export interface OrderData {
  user_id?: number
  order_items_attributes?: OrderItemData[]
  payment_method_id?: number
  payment_intent_id?: number
  address_id?: number
  invoice_info_id?: number
  status?: string
}

export default class OrdersRepository {
  static async save (order: OrderData) {
    return $.ajax({ url: '/admin/orders', method: 'POST', data: { order } })
  }

  static async update (id: string, order: OrderData) {
    return $.ajax({ url: `/orders/${id}`, method: 'PUT', data: { order } })
  }
}
