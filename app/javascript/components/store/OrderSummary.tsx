import React from 'react'
import { Order, OrderItem } from 'definitions/Order'
import { Card, Table } from 'react-bootstrap'
import moment from 'moment'
import { NumberUtils } from 'helpers/NumberUtils'

interface Props {
  order: Order
}

export default function OrderSummary (props: Props) {
  const { order } = props

  moment.locale('es-mx')

  return <>
    <Card.Header>
      <strong className='d-inline-block mr3'>Orden #{order.id}</strong>
      <div className='float-right'>
        <span>Fecha: {moment(order.created_at).format('L')}</span>
      </div>
    </Card.Header>

    <Card.Body>
      <Table borderless={true} className='table-shopping-cart'>
        <thead className='text-muted'>
          <tr>
            <th scope='col' className='col-sm-6'>Producto</th>
            <th scope='col'>Cantidad</th>
            <th scope='col'>P. Unit</th>
            <th scope='col'>Total</th>
            <th scope='col' className='text-right d-none d-md block' style={{ width: 200 }}></th>
          </tr>
        </thead>

        <tbody>
          {order.order_items.map((order_item: OrderItem, index: number) => <OrderItemRow key={`order-item-${index}`} order_item={order_item} />)}
        </tbody>
      </Table>
    </Card.Body>
  </>
}

interface OrderItemRowProps {
  order_item: OrderItem
}

function OrderItemRow (props: OrderItemRowProps) {
  const { order_item } = props

  const product = order_item.product

  return <tr>
    <td>
      <figure className='itemside align-items-center'>
        <div className='aside'>
          <img src={product.pictures[0] || '/assets/gunslinger.jpg'} className='img-sm' />
        </div>

        <figcaption className='info'>
          <span className='title-text-dark'>{product.category_name} - {product.name}</span>
        </figcaption>
      </figure>
    </td>
    <td>
      <input className='form-control form-control-sm col-md-6' disabled={true} value={order_item.qty} />
    </td>
    <td>{NumberUtils.toMoney((product.price / 100))}</td>
    <td>{NumberUtils.toMoney((order_item.qty * product.price) / 100)}</td>
  </tr>
}
