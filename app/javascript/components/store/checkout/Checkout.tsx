import React, { useEffect, useState } from 'react'
import { Card, Row, Col } from 'react-bootstrap'
import { find } from 'lodash'
import { PaymentIntent, PaymentPlan } from 'definitions/PaymentIntent'
import { PaymentMethod } from 'definitions/PaymentMethod'
import { PaymentStatus } from 'definitions/PaymentStatus'
import OrdersRepository from 'repositories/OrdersRepository'
import PaymentIntentsRepository from 'repositories/PaymentIntentsRepository'
import PaymentMethodsRepository from 'repositories/PaymentMethodsRepository'
import PaymentMethodContainer from './PaymentMethodContainer'
import PaymentPlanSelector from './PaymentPlanSelector'
import NullPaymentPlanSelector from './NullPaymentPlanSelector'
import Summary from './Summary'
import Submit from './Submit'
import { Order } from 'definitions/Order'
import OrderSummary from '../OrderSummary'
import { Address } from 'definitions/Address'
import ShippingAddressesSelector from './ShippingAddressesSelector'
import InvoiceAddressSelector from './InvoiceAddressSelector'

declare global {
  interface Window { stripeApiKey: string }
}

interface Props {
  defaultSource: string
  amount: number
  order: Order
}

export default function Checkout (props: Props) {
  const { amount, order } = props
  const amountInCurrency = amount / 100

  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | undefined>()
  const [defaultSource, setDefaultSource] = useState(props.defaultSource)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [showCardForm, setShowCardForm] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan>()
  const [status, setStatus] = useState<PaymentStatus>('pending')
  const [errors, setErrors] = useState<string[]>([])
  const [shippingAddress, setShippingAddress] = useState<Address | undefined>()
  const [invoiceAddress, setInvoiceAddress] = useState<Address | undefined>()

  const handleShippingAddressChange = (address: Address) => {
    setShippingAddress(address)

    if (status === 'failed') {
      setStatus('pending')
      setErrors([])
    }
  }

  const handleInvoiceAddressChange = (address: Address) => {
    setInvoiceAddress(address)
  }

  const handlePaymentMethod = (paymentMethod: PaymentMethod) => {
    setPaymentMethods([...paymentMethods, paymentMethod])
    setDefaultSource(paymentMethod.stripe_id)
    setShowCardForm(false)
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

    if (!shippingAddress) {
      setErrors([...errors, 'Necesitas agregar una dirección de envio para poder realizar el pago.'])
      setStatus('failed')

      return
    }

    setStatus('working')

    const selectedPaymentMethod = find(paymentMethods, { stripe_id: defaultSource })

    try {
      await PaymentIntentsRepository.confirm(paymentIntent.id, { selected_plan: selectedPlan })

      await OrdersRepository.update(order.id, {
        payment_method_id: selectedPaymentMethod.id,
        payment_intent_id: paymentIntent.id,
        status: 'processing',
        address_id: shippingAddress?.id,
        invoice_info_id: invoiceAddress?.id
      })

      setStatus('success')

      setTimeout(() => {
        location.href = `/orders/${order.id}/confirm`
      }, 1000)
    } catch (error) {
      setStatus('failed')
      setErrors(error.responseJSON.errors)
    }
  }

  useEffect(() => {
    PaymentMethodsRepository.all()
      .then((paymentMethods) => {
        if (paymentMethods.length === 0) setShowCardForm(true)
        setPaymentMethods(paymentMethods)
      })
      .catch()
  }, [0])

  useEffect(() => {
    if (!defaultSource || paymentMethods.length === 0) return

    const selectedPaymentMethod = find(paymentMethods, { stripe_id: defaultSource })

    PaymentIntentsRepository.create({ payment_method_id: selectedPaymentMethod.id, amount: amount, idempotency_key: `${selectedPaymentMethod.id}-${order.id}` })
      .then((paymentIntent) => setPaymentIntent(paymentIntent))
      .catch()
  }, [defaultSource, paymentMethods.length])

  useEffect(() => {
    setSelectedPlan(undefined)
  }, [defaultSource])

  return <Row>
    <Col lg={8}>
      <Card>
        <OrderSummary order={order} />

        <Card.Body className='border-top'>
          <ShippingAddressesSelector onChange={handleShippingAddressChange} />
        </Card.Body>

        <Card.Body className='border-top'>
          <InvoiceAddressSelector shippingAddress={shippingAddress} onChange={handleInvoiceAddressChange} />
        </Card.Body>
      </Card>
    </Col>

    <Col lg={4}>
      <Card>
        <Card.Body>
          <PaymentMethodContainer
            onPaymentMethodAdded={handlePaymentMethod}
            onPaymentMethodSelected={handlePaymentMethodSelected}
            onOpen={() => setShowCardForm(true)}
            onClose={() => setShowCardForm(false)}
            showForm={showCardForm}
            status={status}
            paymentMethods={paymentMethods}
            defaultSource={defaultSource} />
        </Card.Body>

        <Card.Body className='border-top'>
          <PaymentPlanSelector
            showForm={showCardForm}
            onSelectPlan={(selectedPlan?: PaymentPlan) => setSelectedPlan(selectedPlan)}
            selectedPlan={selectedPlan}
            paymentIntent={paymentIntent} />

          <NullPaymentPlanSelector
            showForm={showCardForm}
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
