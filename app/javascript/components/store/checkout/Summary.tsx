import React from 'react'
import { NumberUtils } from 'helpers/NumberUtils'
import { PaymentPlan } from 'definitions/PaymentIntent'

interface Props {
  amountInCurrency: number
  selectedPlan?: PaymentPlan
}

export default function Summary (props: Props) {
  const { amountInCurrency, selectedPlan } = props

  return <>
   <h5>Resumen</h5>

    <dl className="dlist-align">
      <dt>Total:</dt>
      <dd className="h5">{NumberUtils.toMoney(amountInCurrency, 2)}</dd>
    </dl>

    {selectedPlan && <dl className="dlist-align">
      <dt>{selectedPlan.count} pagos de:</dt>
      <dd className="h5">{NumberUtils.toMoney(amountInCurrency / selectedPlan.count, 2)}</dd>
    </dl>}
  </>
}
