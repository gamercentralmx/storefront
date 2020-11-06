import React, { useEffect, useState } from 'react'
import { Address } from 'definitions/Address'
import { Button, Col, Form } from 'react-bootstrap'
import { STATES } from 'definitions/STATES'
import AddressesRepository from 'repositories/AddressesRepository'

interface Props {
  onAddressSave: (address: Address) => void
  onEdit: () => void
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

export default function ShippingForm (props: Props) {
  const { onAddressSave, onEdit } = props
  const [address, setAddress] = useState<Address>(emptyAddress)
  const [validated, setValidated] = useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget

    setAddress({ ...address, [name]: value })
    onEdit()
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true)

    const saddress = await AddressesRepository.create(address)

    onAddressSave(saddress)
  }

  return <div>
    <h5>Dirección de envío</h5>

    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Nombre</Form.Label>

        <Form.Control required name='name' value={address.name} onChange={handleChange} placeholder='Casa/Oficina/Taller'></Form.Control>

        <Form.Control.Feedback type="invalid">
          Por favor asigne un nombre para identificar esta dirección
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Row>
        <Form.Group as={Col} lg={6}>
          <Form.Label>Calle y número</Form.Label>

          <Form.Control required name='street' value={address.street} onChange={handleChange} placeholder='Hidalgo #109'></Form.Control>

          <Form.Control.Feedback type="invalid">
            No puede estar vacío
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} lg={4}>
          <Form.Label>Colonia/Localidad</Form.Label>

          <Form.Control required name='neighborhood' value={address.neighborhood} onChange={handleChange} placeholder='Centro'></Form.Control>

          <Form.Control.Feedback type="invalid">
            No puede estar vacío
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} lg={2}>
          <Form.Label>Código Postal</Form.Label>

          <Form.Control required name='zip_code' value={address.zip_code} onChange={handleChange} placeholder='06000'></Form.Control>

          <Form.Control.Feedback type="invalid">
            No puede estar vacío
          </Form.Control.Feedback>
        </Form.Group>
      </Form.Row>

      <Form.Row>
        <Form.Group as={Col} lg={4}>
          <Form.Label>Municipio/Delegación</Form.Label>

          <Form.Control required name='city' value={address.city} onChange={handleChange} placeholder='Cuauhtemoc'></Form.Control>

          <Form.Control.Feedback type="invalid">
            No puede estar vacío
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} lg={4}>
          <Form.Label>Estado</Form.Label>

          <Form.Control required name='state' value={address.state} onChange={handleChange} as='select'>
            {!address.state && <option value=''>Selecciona un estado</option>}
            {STATES.map((state: string, index) => <option key={`state-${index}`} value={state}>{state}</option> )}
          </Form.Control>

          <Form.Control.Feedback type="invalid">
            Seleccione un estado
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} lg={4}>
          <Form.Label>País</Form.Label>
          <Form.Control required name='country' onChange={handleChange} value={address.country} disabled={true}></Form.Control>
        </Form.Group>
      </Form.Row>

      <Button type='submit'>Guardar</Button>
    </Form>

  </div>
}
