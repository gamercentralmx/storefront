import React from 'react'
import { NumberUtils } from 'helpers/NumberUtils'
import { PaymentPlan } from 'definitions/PaymentIntent'
import { Order } from 'definitions/Order'

interface Props {
  order: Order
  selectedPlan?: PaymentPlan
}

export default function Summary (props: Props) {
  const { order, selectedPlan } = props

  return <>
   <h5>Resumen</h5>

    <dl className="dlist-align">
      <dt>Total de articulos:</dt>
      <dd>{NumberUtils.toMoney(order.products_total_in_currency, 2)}</dd>
    </dl>

    <dl className="dlist-align">
      <dt>Costo de envío:</dt>
      <dd>{NumberUtils.toMoney(order.shipping_cost_in_currency, 2)}</dd>
    </dl>

    <dl className="dlist-align">
      <dt>Total:</dt>
      <dd className="h5">{NumberUtils.toMoney(order.total_in_currency, 2)}</dd>
    </dl>

    {selectedPlan && <dl className="dlist-align">
      <dt>{selectedPlan.count} pagos de:</dt>
      <dd className="h5">{NumberUtils.toMoney(order.total_in_currency / selectedPlan.count, 2)}</dd>
    </dl>}
  </>
}
