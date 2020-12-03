import { Category } from 'definitions/Category'
import { find } from 'lodash'
import React, { useState } from 'react'
import { Button, Card, CardGroup, Col, Form } from 'react-bootstrap'
import ProductsRepository, { ProductData } from 'repositories/ProductsRepository'
import ImageUploader from 'react-images-upload'
import { PictureData } from 'definitions/PictureData'
import { Product } from 'definitions/Product'

interface Props {
  categories: Category[]
  product?: Product
}

export default function ProductForm (props: Props) {
  const { categories, product } = props
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(product.category)
  const [name, setName] = useState(product?.name ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [price, setPrice] = useState(product?.price ?? 0)
  const [cost, setCost] = useState(product?.cost ?? 0)
  const [stock, setStock] = useState(product?.stock ?? 0)
  const [metadata, setMetadata] = useState(product?.metadata ?? {})
  const [pictures, setPictures] = useState<PictureData[]>([])
  const [features, setFeatures] = useState<string[]>(product?.features ?? [])

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

  const handleFeaturesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.currentTarget

    setFeatures(value.split('\n'))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      const data: ProductData = {
        name,
        description,
        metadata,
        cost,
        price,
        stock,
        category_id: selectedCategory.id!,
        pictures_data: pictures,
        features
      }

      if (product) {
        await ProductsRepository.update(product.id, data)
      } else {
        await ProductsRepository.save(data)
      }

      location.href = '/admin/products'
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteImage = async (id: number) => {
    try {
      await ProductsRepository.deletePicture(product.id, id)

      location.reload()
    } catch (error) {
      console.error(error)
    }
  }

  return <Form onSubmit={handleSubmit}>
    <Form.Group>
      <Form.Label>Nombre</Form.Label>
      <Form.Control type='text' required name='name' defaultValue={name} onChange={handleNameChange}></Form.Control>
    </Form.Group>

    <Form.Group>
      <Form.Label>Descripción</Form.Label>
      <Form.Control as='textarea' rows={4} required defaultValue={description} name='description' onChange={handleDescriptionChange}></Form.Control>
    </Form.Group>

    {product?.pictures && product.pictures.length > 0 && <Form.Group>
      <Form.Label>Imagenes Actuales</Form.Label>

      <CardGroup>
        {product.pictures.map((picture) => {
          return <Card key={`pictures-${picture.id}`}>
            <Card.Img variant='top' src={picture.url} width={150} style={{ width: '150px' }} />
            <Card.Body>
              <Button variant='danger' onClick={(event) => { event.preventDefault(); handleDeleteImage(picture.id) }}>
                <i className='fa fa-times'/>
                &nbsp;
                Eliminar
              </Button>
            </Card.Body>
          </Card>
        })}
      </CardGroup>
    </Form.Group>}

    <Form.Row>
      <Col>
        <Form.Group>
          <Form.Label>Imagenes del producto</Form.Label>

          <ImageUploader
            className='form-control'
            withIcon={true}
            buttonText="Agregar Fotos del producto"
            onChange={handleImageDrop}
            imgExtension={['.jpg', '.png']}
            withPreview={true}
            maxFileSize={5242880}
          />
        </Form.Group>
      </Col>
    </Form.Row>

    <Form.Row>
      <Col>
        <Form.Group>
          <Form.Label>Costo <small>(en centavos)</small></Form.Label>
          <Form.Control type='number' required name='cost' defaultValue={cost} onChange={handleCostChange}></Form.Control>
        </Form.Group>
      </Col>

      <Col>
        <Form.Group>
          <Form.Label>Precio <small>(en centavos)</small></Form.Label>
          <Form.Control type='number' required name='price' defaultValue={price} onChange={handlePriceChange}></Form.Control>
        </Form.Group>
      </Col>

      <Col>
        <Form.Group>
          <Form.Label>Inventario <small>(en unidades)</small></Form.Label>
          <Form.Control type='number' required name='stock' defaultValue={stock} onChange={handleStockChange}></Form.Control>
        </Form.Group>
      </Col>

      <Col>
        <Form.Group>
          <Form.Label>Categoria</Form.Label>
          <Form.Control as='select' defaultValue={selectedCategory.id} onChange={handleSelect}>
            <option value=''>Categoria no seleccionada</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option> )}
          </Form.Control>
        </Form.Group>
      </Col>
    </Form.Row>



    {selectedCategory && <CategoryForm category={selectedCategory} defaultMetadata={metadata} onChange={handleMetadataChange} />}

    <Form.Row>
      <Col>
        <Form.Group>
          <Form.Label>Caracteristicas <small>(una caracteristica por linea)</small></Form.Label>

          <Form.Control as='textarea'rows={4} required defaultValue={features.join('\n')} onChange={handleFeaturesChange} />
        </Form.Group>
      </Col>
    </Form.Row>

    <Button variant='secondary' href='/admin/products'>Cancelar</Button>
    <Button variant='primary' type='submit' className='float-right'>Guardar</Button>
  </Form>
}

interface CategoryFormProps {
  category: Category
  defaultMetadata?: any
  onChange: (metadata: any) => void
}

function CategoryForm (props: CategoryFormProps) {
  const { category, defaultMetadata, onChange } = props
  const [metadata, setMetadata] = useState<any>(defaultMetadata ?? {})

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
        <Form.Control type={property.type} required defaultValue={metadata[property.name]} name={property.name} onChange={handleChange}></Form.Control>
      </Form.Group>
    })}
  </>
}
