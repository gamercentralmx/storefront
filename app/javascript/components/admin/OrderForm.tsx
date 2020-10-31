import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Product } from 'definitions/Product'
import { User } from 'definitions/User'
import { NumberUtils } from 'helpers/NumberUtils'
import { find, sum } from 'lodash'
import React, { useEffect, useState } from 'react'
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap'
import OrdersRepository from 'repositories/OrdersRepository'
import ProductsRepository from 'repositories/ProductsRepository'
import UsersRepository from 'repositories/UsersRepository'
import { convertToObject } from 'typescript'

export default function OrderForm () {
  const [users, setUsers] = useState<User[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [user, setUser] = useState<any>()
  const [orderItems, setOrderItems] = useState([])
  const [grandTotal, setGrandTotal] = useState(0)
  const [tick, setTick] = useState(0)

  const handleUserSelect =  (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { currentTarget } = event
    const { value } = currentTarget

    const user = find(users, { id: parseInt(value, 10) })

    setUser(user)
  }

  const handleAddNewOrderItem = () => {
    setOrderItems([...orderItems, { id: orderItems.length, qty: 1 }])

    setTick(tick + 1)
  }

  const handleOrderItemChange = (orderItem: any, index: number) => {
    orderItems.splice(index, 1, orderItem)

    setOrderItems(orderItems)

    setTick(tick + 1)
  }

  const handleDeleteOrderItem = (index: number) => {
    setOrderItems([...orderItems.slice(0, index), ...orderItems.slice(index + 1)])

    setTick(tick + 1)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const user_id = user?.id
    const order_items_attributes = orderItems.map((item) => { return { qty: item.qty, product_id: item.product.id } })

    try {
      await OrdersRepository.save({ user_id, order_items_attributes })

      location.href = '/admin/orders'
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    UsersRepository.all()
      .then((users) => setUsers(users))
      .catch()

    ProductsRepository.all()
      .then((products) => setProducts(products))
      .catch()
  }, [0])

  useEffect(() => {
    const total = calculateGrandTotal(orderItems)

    setGrandTotal(total)
  }, [tick])

  return <Form onSubmit={handleSubmit}>
    <Form.Group>
      <Form.Label>Cliente</Form.Label>
      <Form.Control as='select' onChange={handleUserSelect}>
        <option value=''>Sin Cliente Asignado</option>
        {users.map((user) => <option key={`user-${user.id}`} value={user.id}>{user.id}. {user.first_name} {user.last_name} {user.email}</option>)}
      </Form.Control>
    </Form.Group>

    <hr />

    <h5>Articulos</h5>

    <Row>
      <Col sm={1}>
        <h6>Cant.</h6>
      </Col>

      <Col>
        <h6>Producto</h6>
      </Col>

      <Col sm={1}>
        <h6>P. Unit.</h6>
      </Col>

      <Col sm={1}>
        <h6>P. Total</h6>
      </Col>

      <Col sm={1}>
        <h6>Borrar</h6>
      </Col>
    </Row>

    {orderItems.map((orderItem, index) => {
      return <OrderItemForm
        key={`order-item-form-${orderItem.id}`}
        orderItem={orderItem}
        index={index}
        products={products}
        onChange={handleOrderItemChange}
        onRemove={handleDeleteOrderItem} />
    })}

    <Form.Group>
      <Button variant='secondary' onClick={handleAddNewOrderItem}><FontAwesomeIcon icon={faPlus} /> Agregar Producto</Button>
    </Form.Group>

    <hr />

    <Row>
      <Col sm={{ span: 1, offset: 9 }}>
        <h6>Total:</h6>
      </Col>

      <Col sm={2}>
        {NumberUtils.toMoney(grandTotal)}
      </Col>
    </Row>

    <Button variant='secondary' href='/admin/orders'>Cancelar</Button>
    <Button variant='primary' type='submit' className='float-right'>Guardar</Button>
  </Form>
}

function calculateGrandTotal (orderItems: any[]) {
  return sum(orderItems.map((item) => {
    if (!item.product || !item.qty) return 0

    return (item.qty * item.product.price) / 100
  }))
}

interface OrderItemFormProps {
  orderItem: any
  index: number
  products: Product[]
  onChange: (orderItem: any, index: number) => void
  onRemove: (index: number) => void
}

function OrderItemForm (props: OrderItemFormProps) {
  const { orderItem, products, onChange, onRemove, index } = props
  const [qty, setQty] = useState(orderItem.qty)
  const [product, setProduct] = useState<Product>()

  const handleProductSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { currentTarget } = event
    const { value } = currentTarget
    const product = find(products, { id: parseInt(value, 10) })

    orderItem.product = product

    setProduct(product)

    onChange(orderItem, index)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { currentTarget } = event
    const { value } = currentTarget

    orderItem.qty = parseInt(value, 10)

    setQty(orderItem.qty)

    onChange(orderItem, index)
  }

  return <Form.Row>
    <Col sm={1}>
      <Form.Group>
        <Form.Control type='number' name='qty' value={qty.toString()} onChange={handleChange}></Form.Control>
      </Form.Group>
    </Col>

    <Col>
      <Form.Group>
        <Form.Control as='select' onChange={handleProductSelect}>
          <option value=''>Selecciona Producto</option>
          {products.map((product) => <option key={`order-item-product-${product.id}`} value={product.id}>{product.id}. {product.category_name} {product.name}</option>)}
        </Form.Control>
      </Form.Group>
    </Col>

    <Col sm={1} style={{ textAlign: 'center', padding: '10px 0 0' }}>
      {NumberUtils.toMoney((product?.price ?? 0) / 100, 2)}
    </Col>

    <Col sm={1} style={{ textAlign: 'center', padding: '10px 0 0' }}>
      {NumberUtils.toMoney(calculatePrice(qty, product), 2)}
    </Col>

    <Col sm={1} style={{ textAlign: 'center' }}>
      <Button variant='danger' style={{ margin: 0, padding: '8px 10px' }} onClick={() => onRemove(index)}><FontAwesomeIcon icon={faTimes} /></Button>
    </Col>
  </Form.Row>
}

function calculatePrice (qty?: number, product?: Product) {
  if (product === undefined || qty === undefined) return 0

  return (qty * product.price) / 100
}
