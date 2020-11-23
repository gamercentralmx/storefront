import { Category } from 'definitions/Category'
import { find } from 'lodash'
import React, { useState } from 'react'
import { Button, Col, Form } from 'react-bootstrap'
import ProductsRepository from 'repositories/ProductsRepository'
import ImageUploader from 'react-images-upload'
import { PictureData } from 'definitions/PictureData'

interface Props {
  categories: Category[]
}

export default function ProductForm (props: Props) {
  const { categories } = props
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [cost, setCost] = useState(0)
  const [stock, setStock] = useState(0)
  const [metadata, setMetadata] = useState({})
  const [pictures, setPictures] = useState<PictureData[]>([])

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { currentTarget } = event
    const { value } = currentTarget

    setName(value)
  }

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { currentTarget } = event
    const { value } = currentTarget

    setDescription(value)
  }

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { currentTarget } = event
    const { value } = currentTarget

    setPrice(parseInt(value, 10))
  }

  const handleCostChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { currentTarget } = event
    const { value } = currentTarget

    setCost(parseInt(value, 10))
  }

  const handleStockChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { currentTarget } = event
    const { value } = currentTarget

    setStock(parseInt(value, 10))
  }

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { currentTarget } = event
    const { value } = currentTarget

    const category = find(categories, { id: parseInt(value, 10) })

    setSelectedCategory(category)
  }

  const handleImageDrop = (files: File[]) => {
    const picturesData = files.map((file) => {
      return {
        io: file,
        filename: file.name,
        content_type: file.type
      }
    })

    setPictures(picturesData)
  }

  const handleMetadataChange = (metadata: any) => {
    setMetadata(metadata)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      await ProductsRepository.save({
        name,
        description,
        metadata,
        cost,
        price,
        stock,
        category_id: selectedCategory.id!,
        pictures_data: pictures
      })

      location.href = '/admin/products'
    } catch (error) {
      console.error(error)
    }
  }

  return <Form onSubmit={handleSubmit}>
    <Form.Group>
      <Form.Label>Nombre</Form.Label>
      <Form.Control type='text' required name='name' onChange={handleNameChange}></Form.Control>
    </Form.Group>

    <Form.Group>
      <Form.Label>Descripción</Form.Label>
      <Form.Control as='textarea' rows={4} required name='description' onChange={handleDescriptionChange}></Form.Control>
    </Form.Group>

    <Form.Row>
      <Col>
        <ImageUploader
          className='form-control'
          withIcon={true}
          buttonText="Agregar Fotos del producto"
          onChange={handleImageDrop}
          imgExtension={['.jpg', '.png']}
          withPreview={true}
          maxFileSize={5242880}
        />
      </Col>
    </Form.Row>

    <Form.Row>
      <Col>
        <Form.Group>
          <Form.Label>Costo <small>(en centavos)</small></Form.Label>
          <Form.Control type='number' required name='cost' onChange={handleCostChange}></Form.Control>
        </Form.Group>
      </Col>

      <Col>
        <Form.Group>
          <Form.Label>Precio <small>(en centavos)</small></Form.Label>
          <Form.Control type='number' required name='price' onChange={handlePriceChange}></Form.Control>
        </Form.Group>
      </Col>

      <Col>
        <Form.Group>
          <Form.Label>Inventario <small>(en unidades)</small></Form.Label>
          <Form.Control type='number' required name='stock' onChange={handleStockChange}></Form.Control>
        </Form.Group>
      </Col>

      <Col>
        <Form.Group>
          <Form.Label>Categoria</Form.Label>
          <Form.Control as='select' onChange={handleSelect}>
            <option value=''>Categoria no seleccionada</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option> )}
          </Form.Control>
        </Form.Group>
      </Col>
    </Form.Row>



    {selectedCategory && <CategoryForm category={selectedCategory} onChange={handleMetadataChange} />}

    <Button variant='secondary' href='/admin/products'>Cancelar</Button>
    <Button variant='primary' type='submit' className='float-right'>Guardar</Button>
  </Form>
}

interface CategoryFormProps {
  category: Category
  onChange: (metadata: any) => void
}

function CategoryForm (props: CategoryFormProps) {
  const { category, onChange } = props
  const [metadata, setMetadata] = useState<any>({})

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { currentTarget } = event
    const { name, value } = currentTarget

    metadata[name] = value

    setMetadata(metadata)

    onChange(metadata)
  }

  return <>
    {category.properties.map((property) => {
      return <Form.Group key={`properties-${property.name}`}>
        <Form.Label>{property.name}</Form.Label>
        <Form.Control type={property.type} required name={property.name} onChange={handleChange}></Form.Control>
      </Form.Group>
    })}
  </>
}
