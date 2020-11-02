export default class UsersRepository {
  static async all () {
    return $.ajax({ url: '/admin/users' })
  }
}
