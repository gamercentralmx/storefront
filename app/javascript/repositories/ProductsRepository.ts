import { PictureData } from 'definitions/PictureData'
import { toPairs } from 'lodash'

interface ProductData {
  name: string
  description: string
  cost: number
  price: number
  stock: number
  metadata: any
  category_id: number
  pictures_data: PictureData[]
  features: string[]
}

export default class ProductsRepository {
  static async all () {
    return $.ajax({ url: '/admin/products' })
  }

  static async save (data: ProductData) {

    let formData = new FormData()

    formData.append('product[name]', data.name)
    formData.append('product[description]', data.description)
    formData.append('product[cost]', data.cost.toString())
    formData.append('product[price]', data.price.toString())
    formData.append('product[stock]', data.stock.toString())
    formData.append('product[category_id]', data.category_id.toString())

    data.pictures_data.forEach((picture: PictureData, index) => {
      formData.append(`product[pictures_data][${index}][io]`, picture.io)
      formData.append(`product[pictures_data][${index}][filename]`, picture.filename)
      formData.append(`product[pictures_data][${index}][content_type]`, picture.content_type)
    })

    data.features.forEach((feature, index) => formData.append(`product[features][${index}]`, feature))

    toPairs(data.metadata).map(([property, value]) => {
      formData.append(`product[metadata][${property}]`, value.toString())
    })

    return $.ajax({
      url: '/admin/products',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
    })
  }
}
