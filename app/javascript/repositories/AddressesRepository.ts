import { Address } from 'definitions/Address'

export default class AddressesRepository {
  static async all (query: any = {}): Promise<Address[]> {
    return $.ajax({ url: `/direcciones?${$.param(query)}` })
  }

  static async create (address: Address): Promise<Address> {
    return $.ajax({ url: '/direcciones', method: 'POST', data: { address } })
  }

  static async update (addressId: number, address: Address): Promise<Address> {
    return $.ajax({ url: `/direcciones/${addressId}`, method: 'PUT', data: { address } })
  }
}
