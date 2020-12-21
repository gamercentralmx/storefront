import { Category } from 'definitions/Category'
import React from 'react'
import { Card } from 'react-bootstrap'
import CategoriesRepository from 'repositories/CategoriesRepository'
import CategoryForm from './CategoryForm'

interface Props {
  categories: Category[]
  category: Category
}

export default function EditCategory (props: Props) {
  const { category, categories } = props

  const handleSubmit = async (c: Category) => {
    try {
      await CategoriesRepository.update(category.id, { name: c.name, properties: c.properties, parent_id: c.parent_id })

      setTimeout(() => {
        location.href = '/admin/categories'
      }, 500)
    } catch (error) {
      console.error(error)
    }
  }

  return <>
    <Card.Header>
      <h5>Editar categoría: {category.name}</h5>
    </Card.Header>

    <Card.Body>
      <CategoryForm onSubmit={handleSubmit} categories={categories} category={category} />
    </Card.Body>
  </>
}
