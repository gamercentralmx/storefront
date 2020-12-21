import { faPlusCircle, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Category, Property } from 'definitions/Category'
import React, { useState } from 'react'
import { Form, Button, Col } from 'react-bootstrap'

interface Props {
  categories?: Category[]
  category?: Category
  onSubmit: (category: Category) => void
  secondaryButton?: { name: string, action: () => void }
}

export default function CategoryForm (props: Props) {
  const { categories, category, onSubmit, secondaryButton } = props
  const [name, setName] = useState(category?.name ?? '')
  const [properties, setProperties] = useState(category?.properties ?? [])
  const [parentId, setParentId] = useState(category?.parent_id ?? undefined)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    onSubmit({ name, properties, parent_id: parentId })
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

  const handleParentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.currentTarget

    setParentId(parseInt(value, 10))
  }

  return  <Form onSubmit={handleSubmit}>
    {categories && categories.length > 0 && <>
      <Form.Group>
        <Form.Label>Categoria padre <small>(opcional)</small></Form.Label>

        <Form.Control as='select' onChange={handleParentChange} defaultValue={category?.parent_id}>
          <option>Seleccionar categoria padre.</option>

          {categories.map((c, index) => <option value={c.id} key={`category-${index}`}>{c.name}</option>)}
        </Form.Control>
      </Form.Group>
    </>}

    <Form.Group>
      <Form.Label>Nombre</Form.Label>
      <Form.Control type='text' defaultValue={name} required={true} name='name' onChange={handleChange}></Form.Control>
    </Form.Group>

    <Form.Group>
      <Form.Label>Agrega propiedades para esta categoria <small>(opcional)</small></Form.Label>
    </Form.Group>

    {properties && <React.Fragment key={`properties-${properties.length}`}>
      {properties.map((property, index) => <PropertyForm key={index} index={index} property={property} onChange={handlePropertyChange} onRemoveProperty={handleRemoveProperty} />)}
    </React.Fragment>}

    <Form.Group>
      <Button variant='dark' onClick={handleAddProperty}><FontAwesomeIcon icon={faPlusCircle} /> Agregar Propiedad</Button>
    </Form.Group>

    <hr />

    {secondaryButton && <Button variant='secondary' onClick={secondaryButton.action}>{secondaryButton.name}</Button>}
    <Button variant='primary' className='float-right' type='submit'>Guardar</Button>
  </Form>
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
