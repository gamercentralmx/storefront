interface ProductData {
  name: string
  description: string
  cost: number
  price: number
  stock: number
  metadata: any
  category_id: number
}

export default class ProductsRepository {
  static async save (data: ProductData) {
    return $.ajax({ url: '/admin/products', method: 'POST', data: { product: data } })
  }
}
