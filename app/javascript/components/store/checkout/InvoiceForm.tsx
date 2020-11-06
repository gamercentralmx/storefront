import React, { useEffect, useState } from 'react'
import { Address } from 'definitions/Address'
import AddressForm from './AddressForm'
import { Col, Form, Row } from 'react-bootstrap'

interface Props {
  shippingAddress: Address
  onInvoiceAddressChange: (address: Address, useShippingAddress: boolean, invoiceRequired: boolean) => void
}

const emptyAddress = {
  name: '',
  street: '',
  neighborhood: '',
  city: '',
  state: '',
  zip_code: '',
  country: 'México'
}

export default function InvoiceForm (props: Props) {
  const { onInvoiceAddressChange, shippingAddress } = props
  const [address, setAddress] = useState<Address>(emptyAddress)
  const [invoiceRequired, setInvoiceRequired] = useState(false)
  const [useShippingAddress, setUseShippingAddress] = useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget

    setAddress({ ...address, [name]: value })
  }

  const handleAddressChange = (address: Address) => {
    setAddress(address)
  }

  useEffect(() => {
    onInvoiceAddressChange(address, useShippingAddress, invoiceRequired)
  }, [address])

  useEffect(() => {
    if (useShippingAddress) {
      const { name, street, neighborhood, zip_code, city, state, country } = shippingAddress

      setAddress({
        ...address,
        name,
        street,
        neighborhood,
        zip_code,
        city,
        state,
        country
      })
    } else {
      setAddress({
        ...address,
        name: '',
        street: '',
        neighborhood: '',
        zip_code: '',
        city: '',
        state: '',
        country: ''
      })
    }
  }, [useShippingAddress])

  return <div>
    <Form.Check type='switch' id='invoiceRequired' label='Facturar mi pedido' checked={invoiceRequired} onChange={() => setInvoiceRequired(!invoiceRequired)} />

    {invoiceRequired && <>
      <hr />

      <h5>Datos de la empresa</h5>

      <Row>
        <Col lg={4}>
          <Form.Group>
            <Form.Label>Tipo de Persona</Form.Label>

            <Form.Control as='select' name='business_type' onChange={handleChange}>
              <option>Seleccionar</option>
              <option>Persona Física</option>
              <option>Persona Moral</option>
            </Form.Control>
          </Form.Group>
        </Col>

        <Col lg={4}>
          <Form.Group>
            <Form.Label>Razón Social</Form.Label>

            <Form.Control name='business_name' placeholder='Mi empresa' onChange={handleChange} />
          </Form.Group>
        </Col>

        <Col lg={4}>
          <Form.Group>
            <Form.Label>RFC</Form.Label>

            <Form.Control name='tax_id' placeholder='XAXX010101000' onChange={handleChange} />
          </Form.Group>
        </Col>
      </Row>

      <h5>Domicilio Fiscal</h5>

      <Form.Check type='switch' id='useShippingAddress' label='Usar dirección de envío' checked={useShippingAddress} onChange={() => setUseShippingAddress(!useShippingAddress)} />

      <AddressForm defaultAddress={address} onAddressChange={handleAddressChange} />
    </>}
  </div>
}
