import { Category } from "definitions/Category";

export default class CategoriesRepository {
  static async save (category: Category) {
    return $.ajax({ url: '/admin/categories', method: 'POST', data: { category: category } })
  }
}
