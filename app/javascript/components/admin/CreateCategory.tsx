import { faPlusCircle, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Property } from 'definitions/Category'
import React, { useState } from 'react'
import { Button, Col, Form, Modal } from 'react-bootstrap'
import CategoriesRepository from 'repositories/CategoriesRepository'


export default function CreateCategory () {
  const [show, setShow] = useState(false)
  const [name, setName] = useState('')
  const [properties, setProperties] = useState([])

  const handleClose = () => {
    setName('')
    setProperties([])
    setShow(false)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      await CategoriesRepository.save({ name: name, properties: properties })

      setShow(false)

      setTimeout(() => {
        location.reload()
      }, 500)
    } catch (error) {
      console.error(error)
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { currentTarget } = event
    const { value } = currentTarget

    setName(value)
  }

  const handleAddProperty = () => {
    setProperties([...properties, { name: '', type: 'string' }])
  }

  const handleRemoveProperty = (index: number) => {
    properties.splice(index, 1)

    setProperties(properties.slice())
  }

  const handlePropertyChange = (property: Property, index: number) => {
    properties.splice(index, 1, property)

    setProperties(properties)
  }

  return <>
    <Button variant='primary' onClick={() => setShow(true)}>Crear nueva categoria</Button>

    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        Crear nueva categoria
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control type='text' defaultValue={name} required={true} name='name' onChange={handleChange}></Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Agrega propiedades para esta categoria <i>(opcional)</i></Form.Label>
            </Form.Group>

            {properties && <React.Fragment key={`properties-${properties.length}`}>
              {properties.map((property, index) => <PropertyForm key={index} index={index} property={property} onChange={handlePropertyChange} onRemoveProperty={handleRemoveProperty} />)}
            </React.Fragment>}

            <Form.Group>
              <Button variant='dark' onClick={handleAddProperty}><FontAwesomeIcon icon={faPlusCircle} /> Agregar Propiedad</Button>
            </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>Cerrar</Button>
          <Button variant='primary' type='submit'>Guardar</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  </>
}

function PropertyForm ({ property, index, onChange, onRemoveProperty }) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { currentTarget } = event
    const { name, value } = currentTarget

    property[name as any] = value

    onChange(property, index)
  }

  return <>
    <Form.Row>
      <Col xs={6} >
        <Form.Control type='text' name='name' defaultValue={property.name} onChange={handleChange} placeholder='nombre'></Form.Control>
      </Col>

      <Col xs={5}>
        <Form.Control as='select' name='type' defaultValue={property.type} onChange={handleChange}>
          <option>text</option>
          <option>number</option>
        </Form.Control>
      </Col>

      <Col xs={1}>
        <Button variant='danger' style={{ margin: 0, padding: '8px 10px' }} onClick={() => onRemoveProperty(index)}><FontAwesomeIcon icon={faTimes} /></Button>
      </Col>
    </Form.Row>

    <hr />
  </>
}
