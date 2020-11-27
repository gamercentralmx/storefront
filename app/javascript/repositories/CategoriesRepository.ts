import { Property } from 'definitions/Category'

interface CategoryData {
  name: string,
  properties: Property[]
}

export default class CategoriesRepository {
  static async save (category: CategoryData) {
    return $.ajax({ url: '/admin/categories', method: 'POST', data: { category: category } })
  }

  static async update (id: number, category: CategoryData) {
    return $.ajax({ url: `/admin/categories/${id}`, method: 'PUT', data: { category } })
  }
}
