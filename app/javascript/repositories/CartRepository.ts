export default class CartRepository {
  static async add (productId: number) {
    return $.ajax({
      url: `/carrito/agregar?${$.param({ product_id: productId })}`,
      method: 'PUT'
    })
  }
}
