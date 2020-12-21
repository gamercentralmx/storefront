import { Category } from 'definitions/Category'
import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import CategoriesRepository from 'repositories/CategoriesRepository'
import CategoryForm from './CategoryForm'

interface Props {
  categories: Category[]
}


export default function CreateCategory (props: Props) {
  const { categories } = props
  const [show, setShow] = useState(false)

  const handleClose = () => {
    setShow(false)
  }

  const handleSubmit = async (category: Category) => {
    try {
      await CategoriesRepository.save({ name: category.name, properties: category.properties, parent_id: category.parent_id })

      setShow(false)

      setTimeout(() => {
        location.reload()
      }, 500)
    } catch (error) {
      console.error(error)
    }
  }

  return <>
    <Button variant='primary' onClick={() => setShow(true)}>Crear nueva categoria</Button>

    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        Crear nueva categoria
      </Modal.Header>

      <Modal.Body>
        <CategoryForm
          onSubmit={handleSubmit}
          categories={categories}
          secondaryButton={{ action: handleClose, name: 'Cerrar' }} />
      </Modal.Body>
    </Modal>
  </>
}
