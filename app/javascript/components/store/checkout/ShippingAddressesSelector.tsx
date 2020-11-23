import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Address } from 'definitions/Address'
import { find } from 'lodash'
import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import AddressesRepository from 'repositories/AddressesRepository'
import AddressForm from './AddressForm'

interface Props {
  onChange: (address: Address) => void
}

export default function ShippingAddressesSelector (props: Props) {
  const { onChange } = props
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<Address | undefined>()
  const [showForm, setShowForm] = useState(false)

  const handleAddressSave = (address: Address) => {
    setAddresses([...addresses, address])
    setSelectedAddress(address)
    onChange(address)
    setShowForm(false)
  }

  const handleSelectedAddressChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.currentTarget

    const newSelectedAddress = find(addresses, { id: parseInt(value, 10) })

    setSelectedAddress(newSelectedAddress)
  }

  useEffect(() => {
    AddressesRepository.all()
      .then((addresses) => {
        setAddresses(addresses)
        setShowForm(addresses.length === 0)

        if (addresses.length > 0) {
          setSelectedAddress(addresses[0])
        }
      })
      .catch()
  }, [0])

  useEffect(() => {
    if (selectedAddress) onChange(selectedAddress)
  }, [selectedAddress])

  if (showForm) return <AddressForm onAddressSave={handleAddressSave} onClose={() => setShowForm(false)} />

  return <>
    <Form.Group>
      <Form.Label>Seleccione una dirección de envío</Form.Label>
      <Form.Control as='select' custom onChange={handleSelectedAddressChange} value={selectedAddress?.id}>
        {addresses.map((address) => <option key={`address-${address.id}`} value={address.id}>{formattedAddressName(address)}</option>)}
      </Form.Control>
    </Form.Group>

    <Button variant='secondary' className='btn-block' onClick={() => setShowForm(true)}><FontAwesomeIcon icon={faPlusCircle} /> Agregar nueva dirección</Button>
  </>
}

function formattedAddressName (address: Address) {
  return `${address.name} - ${address.street}, ${address.neighborhood}, ${address.city}, ${address.state}, CP ${address.zip_code}`
}
