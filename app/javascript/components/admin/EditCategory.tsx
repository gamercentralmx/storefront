import { faPlusCircle, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Category, Property } from 'definitions/Category'
import React, { useState } from 'react'
import { Button, Card, Col, Form, Modal } from 'react-bootstrap'
import CategoriesRepository from 'repositories/CategoriesRepository'

interface Props {
  category: Category
}

export default function EditCategory (props: Props) {
  const { category } = props
  const [name, setName] = useState(category.name)
  const [properties, setProperties] = useState(category.properties)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      await CategoriesRepository.update(category.id, { name: name, properties: properties })

      setTimeout(() => {
        location.href = '/admin/categories'
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
    <Card.Header>
      <h5>Editar categoría: {category.name}</h5>
    </Card.Header>

    <Card.Body>
      <Form onSubmit={handleSubmit}>
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

        <Button variant='primary' type='submit'>Guardar</Button>
      </Form>
    </Card.Body>
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
