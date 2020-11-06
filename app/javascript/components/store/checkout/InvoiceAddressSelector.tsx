import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Address } from 'definitions/Address'
import { find } from 'lodash'
import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import AddressesRepository from 'repositories/AddressesRepository'
import AddressForm from './AddressForm'

interface Props {
  shippingAddress: Address
  onChange: (address: Address) => void
}

export default function InvoiceAddressSelector (props: Props) {
  const { shippingAddress, onChange } = props
  const [invoiceRequired, setInvoiceRequired] = useState(false)
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
    AddressesRepository.all({ type: 'invoice' })
      .then((addresses) => {
        setAddresses(addresses)
        setShowForm(addresses.length === 0)

        if (addresses.length > 1) setSelectedAddress(addresses[0])
      })
      .catch()
  }, [0])

  return <>
    <Form.Check type='switch' id='invoiceRequired' label='Facturar mi pedido' checked={invoiceRequired} onChange={() => setInvoiceRequired(!invoiceRequired)} />

    {invoiceRequired && <>
      <hr />

      {showForm && <AddressForm
        defaultAddress={shippingAddress}
        onAddressSave={handleAddressSave}
        isTaxForm={true}
        onClose={() => setShowForm(false)} />}

      {!showForm && <>
        <Form.Group>
          <Form.Label>Seleccione los datos de facturación</Form.Label>
          <Form.Control as='select' custom onChange={handleSelectedAddressChange} value={selectedAddress?.id}>
            {addresses.map((address) => <option key={`address-${address.id}`} value={address.id}>{formattedAddressName(address)}</option>)}
          </Form.Control>
        </Form.Group>

        <Button variant='secondary' className='btn-block' onClick={() => setShowForm(true)}><FontAwesomeIcon icon={faPlusCircle} /> Agregar nueva dirección de facturación</Button>
      </>}
    </>}
  </>
}

function formattedAddressName (address: Address) {
  return `${address.business_name} - ${address.tax_id}`
}
