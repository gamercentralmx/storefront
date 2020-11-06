import { PaymentIntent, PaymentPlan } from 'definitions/PaymentIntent'
import { PaymentMethod } from 'definitions/PaymentMethod'
import { PaymentStatus } from 'definitions/PaymentStatus'
import { find } from 'lodash'
import React, { useEffect, useState } from 'react'
import { Card, Row, Col } from 'react-bootstrap'
import OrdersRepository from 'repositories/OrdersRepository'
import PaymentIntentsRepository from 'repositories/PaymentIntentsRepository'
import PaymentMethodsRepository from 'repositories/PaymentMethodsRepository'
import PaymentMethodContainer from './PaymentMethodContainer'
import PaymentPlanSelector from './PaymentPlanSelector'
import NullPaymentPlanSelector from './NullPaymentPlanSelector'
import Summary from './Summary'
import Submit from './Submit'

declare global {
  interface Window { stripeApiKey: string }
}

interface Props {
  defaultSource: string
  amount: number
  orderId: string
}

export default function Checkout (props: Props) {
  const { amount, orderId } = props
  const amountInCurrency = amount / 100

  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | undefined>()
  const [defaultSource, setDefaultSource] = useState(props.defaultSource)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [showForm, setShowForm] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan>()
  const [status, setStatus] = useState<PaymentStatus>('pending')
  const [errors, setErrors] = useState<string[]>([])

  const handlePaymentMethod = (paymentMethod: PaymentMethod) => {
    setPaymentMethods([...paymentMethods, paymentMethod])
    setDefaultSource(paymentMethod.stripe_id)
    setShowForm(false)
  }

  const handlePaymentMethodSelected = (paymentMethod: PaymentMethod) => {
    setErrors([])
    setStatus('pending')
    PaymentMethodsRepository.makeDefault(paymentMethod.id)
      .then(() => setDefaultSource(paymentMethod.stripe_id))
      .catch()
  }

  const handleSubmitCheckout = async () => {
    if (status === 'success') return

    setStatus('working')

    const selectedPaymentMethod = find(paymentMethods, { stripe_id: defaultSource })

    try {
      await PaymentIntentsRepository.confirm(paymentIntent.id, { selected_plan: selectedPlan })
      await OrdersRepository.update(orderId, { payment_method_id: selectedPaymentMethod.id, payment_intent_id: paymentIntent.id, status: 'processing' })
      setStatus('success')

      setTimeout(() => {
        location.href = `/orders/${orderId}/confirm`
      }, 1000)
    } catch (error) {
      setStatus('failed')
      setErrors(error.responseJSON.errors)
    }
  }

  useEffect(() => {
    PaymentMethodsRepository.all()
      .then((paymentMethods) => {
        if (paymentMethods.length === 0) setShowForm(true)
        setPaymentMethods(paymentMethods)
      })
      .catch()
  }, [0])

  useEffect(() => {
    if (!defaultSource || paymentMethods.length === 0) return

    const selectedPaymentMethod = find(paymentMethods, { stripe_id: defaultSource })

    PaymentIntentsRepository.create({ payment_method_id: selectedPaymentMethod.id, amount: amount, idempotency_key: `${selectedPaymentMethod.id}-${orderId}` })
      .then((paymentIntent) => setPaymentIntent(paymentIntent))
      .catch()
  }, [defaultSource, paymentMethods.length])

  useEffect(() => {
    setSelectedPlan(undefined)
  }, [defaultSource])

  return <Row>
    <Col lg={4}>
      <Card>
        <Card.Body>
          <PaymentMethodContainer
            onPaymentMethodAdded={handlePaymentMethod}
            onPaymentMethodSelected={handlePaymentMethodSelected}
            onOpen={() => setShowForm(true)}
            onClose={() => setShowForm(false)}
            showForm={showForm}
            status={status}
            paymentMethods={paymentMethods}
            defaultSource={defaultSource} />
        </Card.Body>

        <Card.Body className='border-top'>
          <PaymentPlanSelector
            showForm={showForm}
            onSelectPlan={(selectedPlan?: PaymentPlan) => setSelectedPlan(selectedPlan)}
            selectedPlan={selectedPlan}
            paymentIntent={paymentIntent} />

          <NullPaymentPlanSelector
            showForm={showForm}
            paymentIntent={paymentIntent} />
        </Card.Body>

        <Card.Body className='border-top'>
          <Summary amountInCurrency={amountInCurrency} selectedPlan={selectedPlan} />

          <hr />

          <Submit status={status} errors={errors} onSubmit={handleSubmitCheckout} />
        </Card.Body>
      </Card>
    </Col>
  </Row>
}
