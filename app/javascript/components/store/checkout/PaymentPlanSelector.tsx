import React from "react"
import { Button, ButtonGroup, Card } from "react-bootstrap"
import { PaymentIntent, PaymentPlan } from "definitions/PaymentIntent"

interface Props {
  showForm: boolean
  onSelectPlan: (selectedPlan?: PaymentPlan) => void
  selectedPlan?: PaymentPlan
  paymentIntent?: PaymentIntent
}

export default function PaymentPlanSelector (props: Props) {
  const {
    showForm,
    onSelectPlan,
    selectedPlan,
    paymentIntent
  } = props

  if (showForm || (!paymentIntent || paymentIntent?.payment_method_options?.card?.installments?.available_plans?.length === 0)) return <></>

  return <>
    <h5>Pago a meses sin intereses</h5>

    <ButtonGroup>
      <Button variant='outline-secondary' disabled={status === 'success'} onClick={() => onSelectPlan(undefined)} active={selectedPlan === undefined}>1 MSI</Button>
      {paymentIntent.payment_method_options.card.installments.available_plans.map((plan) => {
        if (plan.count > 12) return

        return <Button
          key={`plan-type-${plan.count}`}
          variant='outline-secondary'
          disabled={status === 'success'}
          onClick={() => onSelectPlan(plan)} active={selectedPlan?.count === plan.count}>
            {plan.count} MSI
        </Button>
      })}
    </ButtonGroup>
  </>
}
