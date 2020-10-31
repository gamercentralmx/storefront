interface ProductData {
  name: string
  category_id: number
  description: string
  metadata: any
}

export default class ProductsRepository {
  static async save (data: ProductData) {
    return $.ajax({ url: '/admin/products', method: 'POST', data: { product: data } })
  }
}
