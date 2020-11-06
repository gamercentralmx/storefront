import React, { useEffect, useState } from 'react'
import { Address } from 'definitions/Address'
import AddressForm from './AddressForm'
import { PaymentStatus } from 'definitions/PaymentStatus'

interface Props {
  onAddressChange: (address: Address) => void
  status: PaymentStatus
}

export default function ShippingForm (props: Props) {
  const { onAddressChange, status } = props
  const [address, setAddress] = useState<Address>({
    name: '',
    street: '',
    neighborhood: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'México'
  })

  const handleAddressChange = (address: Address) => {
    setAddress(address)
  }

  useEffect(() => {
    onAddressChange(address)
  }, [address])

  return <div>
    <h5>Dirección de envío</h5>

    <AddressForm status={status} defaultAddress={address} onAddressChange={handleAddressChange} />
  </div>
}
