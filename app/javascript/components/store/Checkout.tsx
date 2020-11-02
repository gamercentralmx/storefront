import { PaymentIntent } from 'definitions/PaymentIntent'
import { PaymentMethod } from 'definitions/PaymentMethod'
import { NumberUtils } from 'helpers/NumberUtils'
import StringUtils from 'helpers/StringUtils'
import { find } from 'lodash'
import React, { useEffect, useState } from 'react'
import { Form, Col, Table, Button, Dropdown, Card, ButtonGroup, Tooltip, Popover, OverlayTrigger } from 'react-bootstrap'
import { StripeProvider, Elements } from 'react-stripe-elements'
import PaymentMethodsRepository from 'repositories/PaymentMethodsRepository'
import PaymentForm from './PaymentForm'

declare global {
  interface Window { stripeApiKey: string }
}

interface Props {
  defaultSource: string
  amount: number
}

export default function Checkout (props: Props) {
  const { amount } = props
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | undefined>()
  const [defaultSource, setDefaultSource] = useState(props.defaultSource)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [showForm, setShowForm] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(0)

  const handlePaymentMethod = (paymentMethod: PaymentMethod) => {
    setPaymentMethods([...paymentMethods, paymentMethod])
    setDefaultSource(paymentMethod.stripe_id)
    setShowForm(false)
  }

  const handlePaymentMethodSelected = (paymentMethod: PaymentMethod) => {
    PaymentMethodsRepository.makeDefault(paymentMethod.id)
      .then(() => setDefaultSource(paymentMethod.stripe_id))
      .catch()
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

    PaymentMethodsRepository.installments(selectedPaymentMethod.id, amount)
      .then((paymentIntent) => setPaymentIntent(paymentIntent))
      .catch()
  }, [defaultSource, paymentMethods.length])

  useEffect(() => {
    setSelectedPlan(0)
  }, [defaultSource])

  const popover = (
    <Popover id="popover-basic">
      <Popover.Title as="h3">Tarjetas Participantes a meses sin intereses</Popover.Title>
      <Popover.Content>
        <ul>
          <li>Afirme</li>
          <li>American Express</li>
          <li>BanBajío</li>
          <li>Banca Mifel</li>
          <li>Banco Azteca</li>
          <li>Banco Famsa</li>
          <li>Banco Invex</li>
          <li>Banjercito</li>
          <li>Banorte</li>
          <li>Banregio</li>
          <li>BBVA</li>
          <li>Citibanamex</li>
          <li>HSBC</li>
          <li>Inbursa</li>
          <li>Liverpool</li>
          <li>Santander</li>
          <li>Scotiabank</li>
        </ul>
      </Popover.Content>
    </Popover>
  )

  return <Card className='shadow'>
    <Card.Body>
      <h5>Método de pago</h5>
      {showForm && <StripeForm
        onPaymentMethodAdded={handlePaymentMethod}
        onClose={() => setShowForm(false)}
        hasPaymentMethods={paymentMethods.length > 0} />}

      {!showForm && <PaymentMethodsTable
        defaultSource={defaultSource}
        paymentMethods={paymentMethods}
        onDisplayForm={() => setShowForm(true)}
        onPaymentMethodSelected={handlePaymentMethodSelected} />}
    </Card.Body>

    {!showForm && paymentIntent && paymentIntent.available_plans.length > 0 && <Card.Body className='border-top'>
      <h5>Pago a meses sin intereses</h5>

      <ButtonGroup>
        {paymentIntent.available_plans.map((plan) => {
          if (plan.count > 12) return

          return <Button
            variant='outline-secondary'
            onClick={() => setSelectedPlan(plan.count)} active={selectedPlan === plan.count}>
              {plan.count} meses
          </Button>
        })}
      </ButtonGroup>
    </Card.Body>}

    {!showForm && paymentIntent && paymentIntent.available_plans.length === 0 && <Card.Body className='border-top'>
      <p>
        Pago a meses sin intereses no disponible.&nbsp;
        <OverlayTrigger trigger='hover' placement='bottom' overlay={popover}>
          <a href='javascript:void(0)'>Consulta las tarjetas participantes.</a>
        </OverlayTrigger>
      </p>
    </Card.Body>}

    <Card.Body className='border-top'>
      <h5>Resumen</h5>

      <dl className="dlist-align">
        <dt>Total:</dt>
        <dd className="h5">{NumberUtils.toMoney(amount / 100, 2)}</dd>
      </dl>

      <hr />

      <Button variant='primary' className='btn-block'>Confirmar Compra</Button>
    </Card.Body>
  </Card>
}

interface StripeFormProps {
  onPaymentMethodAdded: (paymentMethod: PaymentMethod) => void
  onClose: () => void
  hasPaymentMethods: boolean
}

function StripeForm (props: StripeFormProps) {

  return <StripeProvider apiKey={window.stripeApiKey}>
    <div className='example'>
      <Elements>
        <PaymentForm {...props} />
      </Elements>
    </div>
  </StripeProvider>
}

interface PaymentMethodsTableProps {
  defaultSource: string
  paymentMethods: PaymentMethod[]
  onDisplayForm: () => void
  onPaymentMethodSelected: (paymentMethod: PaymentMethod) => void
}

function PaymentMethodsTable (props: PaymentMethodsTableProps) {
  const { defaultSource, paymentMethods, onDisplayForm, onPaymentMethodSelected } = props

  const selectedPaymentMethod = find(paymentMethods, { stripe_id: defaultSource })

  if (!selectedPaymentMethod) return <></>

  return <div>
    <Dropdown>
      <Dropdown.Toggle variant='outline-dark' className='btn-block'>
        <FormattedPaymentMethod paymentMethod={selectedPaymentMethod} />
      </Dropdown.Toggle>

      <Dropdown.Menu className='full-width'>
        {paymentMethods.map((paymentMethod) => {
          return <Dropdown.Item key={`payment-method-item-${paymentMethod.id}`} onClick={() => onPaymentMethodSelected(paymentMethod)} active={selectedPaymentMethod.id === paymentMethod.id}>
            <FormattedPaymentMethod paymentMethod={paymentMethod} />
          </Dropdown.Item>
        })}
        <Dropdown.Item onClick={() => onDisplayForm()}>Agregar Nueva Tarjeta</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  </div>
}

interface FormattedPaymentMethodProps {
  paymentMethod: PaymentMethod
}

function FormattedPaymentMethod (props: FormattedPaymentMethodProps) {
  const { paymentMethod } = props
  const { name, brand, last4, exp_month, exp_year } = paymentMethod.metadata

  return <>
    {StringUtils.truncate(name, 15)} &nbsp; <i className={`fab fa-cc-${brand.toLowerCase()}`}></i> **** {last4} - {exp_month}/{exp_year}
  </>
}
