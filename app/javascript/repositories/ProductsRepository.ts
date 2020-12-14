import { PictureData } from 'definitions/PictureData'
import { toPairs } from 'lodash'

export interface ProductData {
  name: string
  description: string
  cost: number
  price: number
  stock: number
  weight: number
  metadata: any
  category_id: number
  pictures_data: PictureData[]
  cover_picture?: PictureData
  features: string[]
}

export default class ProductsRepository {
  static async all () {
    return $.ajax({ url: '/admin/products' })
  }

  static async save (data: ProductData) {
    return $.ajax({
      url: '/admin/products',
      type: 'POST',
      data: this.buildFormData(data),
      processData: false,
      contentType: false,
    })
  }

  static async update (id: number, data: ProductData) {
    return $.ajax({
      url: `/admin/products/${id}`,
      type: 'PUT',
      data: this.buildFormData(data),
      processData: false,
      contentType: false,
    })
  }

  static async deletePicture (id: number, pictureId: number) {
    return $.ajax({
      url: `/admin/products/${id}/delete_picture?picture_id=${pictureId}`,
      type: 'DELETE'
    })
  }

  private static buildFormData (data: ProductData): FormData {
    let formData = new FormData()

    formData.append('product[name]', data.name)
    formData.append('product[description]', data.description)
    formData.append('product[cost]', data.cost.toString())
    formData.append('product[price]', data.price.toString())
    formData.append('product[stock]', data.stock.toString())
    formData.append('product[weight]', data.weight.toString())
    formData.append('product[category_id]', data.category_id.toString())

    data.pictures_data.forEach((picture: PictureData, index) => {
      formData.append(`product[pictures_data][${index}][io]`, picture.io)
      formData.append(`product[pictures_data][${index}][filename]`, picture.filename)
      formData.append(`product[pictures_data][${index}][content_type]`, picture.content_type)
    })

    if (data.cover_picture !== undefined) {
      formData.append(`product[cover_picture][io]`, data.cover_picture.io)
      formData.append(`product[cover_picture][filename]`, data.cover_picture.filename)
      formData.append(`product[cover_picture][content_type]`, data.cover_picture.content_type)
    }

    data.features.forEach((feature, index) => formData.append(`product[features][${index}]`, feature))

    toPairs(data.metadata).map(([property, value]) => {
      formData.append(`product[metadata][${property}]`, value.toString())
    })

    return formData
  }
}
