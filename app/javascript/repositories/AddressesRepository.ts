import { Address } from 'definitions/Address'

export default class AddressesRepository {
  static async all (): Promise<Address[]> {
    return $.ajax({ url: '/addresses' })
  }

  static async create (address: Address): Promise<Address> {
    return $.ajax({ url: '/addresses', method: 'POST', data: { address } })
  }

  static async update (addressId: number, address: Address): Promise<Address> {
    return $.ajax({ url: `/addresses/${addressId}`, method: 'PUT', data: { address } })
  }
}
