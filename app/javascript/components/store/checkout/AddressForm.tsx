import React, { useEffect, useState } from 'react'
import { Form, Row, Col } from 'react-bootstrap'
import { Address } from 'definitions/Address'
import { STATES } from 'definitions/STATES'
import { PaymentStatus } from 'definitions/PaymentStatus'
import { forEach } from 'lodash'

interface Props {
  defaultAddress: Address
  onAddressChange: (address: Address) => void
  status?: PaymentStatus
}

export default function AddressForm (props: Props) {
  const { defaultAddress, onAddressChange, status = 'pending' } = props
  const [address, setAddress] = useState(defaultAddress)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget

    setAddress({ ...address, [name]: value })
  }

  useEffect(() => {
    onAddressChange(address)
  }, [address])

  useEffect(() => {
    setAddress(defaultAddress)
  }, [defaultAddress])

  return <>
    <Form.Group>
      <Form.Label>Nombre</Form.Label>

      <Form.Control required name='name' value={address.name} onChange={handleChange} placeholder='Casa/Oficina/Taller' isValid={status !== 'failed' && address.name.length > 0}></Form.Control>
    </Form.Group>

    <Row>
      <Col lg={6}>
        <Form.Group>
          <Form.Label>Calle y número</Form.Label>

          <Form.Control required name='street' value={address.street} onChange={handleChange} placeholder='Hidalgo #109' isValid={status !== 'failed' && address.street.length > 0}></Form.Control>
        </Form.Group>
      </Col>

      <Col lg={4}>
        <Form.Group>
          <Form.Label>Colonia/Localidad</Form.Label>

          <Form.Control required name='neighborhood' value={address.neighborhood} onChange={handleChange} placeholder='Centro' isValid={status !== 'failed' && address.neighborhood.length > 0}></Form.Control>
        </Form.Group>
      </Col>

      <Col lg={2}>
        <Form.Group>
          <Form.Label>Código Postal</Form.Label>

          <Form.Control required name='zip_code' value={address.zip_code} onChange={handleChange} placeholder='06000' isValid={status !== 'failed' && address.zip_code.length > 0}></Form.Control>
        </Form.Group>
      </Col>
    </Row>

    <Row>
      <Col lg={4}>
        <Form.Group>
          <Form.Label>Municipio/Delegación</Form.Label>

          <Form.Control required name='city' value={address.city} onChange={handleChange} placeholder='Cuauhtemoc' isValid={status !== 'failed' && address.city.length > 0}></Form.Control>
        </Form.Group>
      </Col>

      <Col lg={4}>
        <Form.Group>
          <Form.Label>Estado</Form.Label>

          <Form.Control required name='state' value={address.state} onChange={handleChange} as='select' isValid={status !== 'failed' && address.state.length > 0}>
            {!address.state && <option>Selecciona un estado</option>}
            {STATES.map((state: string, index) => <option key={`state-${index}`} value={state}>{state}</option> )}
          </Form.Control>
        </Form.Group>
      </Col>

      <Col lg={4}>
        <Form.Group>
          <Form.Label>País</Form.Label>
          <Form.Control required name='country' onChange={handleChange} value={address.country} disabled={true}></Form.Control>
        </Form.Group>
      </Col>
    </Row>
  </>
}
