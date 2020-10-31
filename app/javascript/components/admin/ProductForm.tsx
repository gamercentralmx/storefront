import { Category } from 'definitions/Category'
import { find } from 'lodash'
import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'

interface Props {
  categories: Category[]
}

export default function ProductForm (props: Props) {
  const { categories } = props
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>()

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { currentTarget } = event
    const { value } = currentTarget

    const category = find(categories, { id: parseInt(value, 10) })

    setSelectedCategory(category)
  }

  return <Form>
    <Form.Group>
      <Form.Label>Nombre</Form.Label>
      <Form.Control type='text' required name='name'></Form.Control>
    </Form.Group>

    <Form.Group>
      <Form.Label>Descripción</Form.Label>
      <Form.Control as='textarea' rows={4} required name='description'></Form.Control>
    </Form.Group>

    <Form.Group>
      <Form.Label>Categoria</Form.Label>
      <Form.Control as='select' onChange={handleSelect}>
        <option value=''>Categoria no seleccionada</option>
        {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option> )}
      </Form.Control>
    </Form.Group>

    {selectedCategory && <CategoryForm category={selectedCategory} />}

    <Button variant='secondary' href='/admin/products'>Cancelar</Button>
    <Button variant='primary' className='float-right'>Guardar</Button>
  </Form>
}

interface CategoryFormProps {
  category: Category
}

function CategoryForm (props: CategoryFormProps) {
  const { category } = props

  return <>
    {category.properties.map((property) => {
      return <Form.Group key={`properties-${property.name}`}>
        <Form.Label>{property.name}</Form.Label>
        <Form.Control type={property.type} required name={property.name}></Form.Control>
      </Form.Group>
    })}
  </>
}
