import { PaymentIntent } from 'definitions/PaymentIntent'
import { PaymentMethod } from 'definitions/PaymentMethod'
import { NumberUtils } from 'helpers/NumberUtils'
import StringUtils from 'helpers/StringUtils'
import { find } from 'lodash'
import React, { useEffect, useState } from 'react'
import { Button, Dropdown, Card, ButtonGroup, Popover, OverlayTrigger } from 'react-bootstrap'
import { StripeProvider, Elements } from 'react-stripe-elements'
import OrdersRepository from 'repositories/OrdersRepository'
import PaymentMethodsRepository from 'repositories/PaymentMethodsRepository'
import PaymentForm from './PaymentForm'

declare global {
  interface Window { stripeApiKey: string }
}

type PaymentStatus = 'pending' | 'working' | 'success' | 'failed'

const submitIntent = {
  pending: 'primary',
  working: 'primary',
  success: 'success',
  failed: 'danger'
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
  const [selectedPlan, setSelectedPlan] = useState<any>()
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
      await PaymentMethodsRepository.charge(selectedPaymentMethod.id, paymentIntent.intent_id, selectedPlan)
      await OrdersRepository.update(orderId, 'processing')
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

    PaymentMethodsRepository.installments(selectedPaymentMethod.id, amount)
      .then((paymentIntent) => setPaymentIntent(paymentIntent))
      .catch()
  }, [defaultSource, paymentMethods.length])

  useEffect(() => {
    setSelectedPlan(undefined)
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
        status={status}
        onPaymentMethodSelected={handlePaymentMethodSelected} />}
    </Card.Body>

    {!showForm && paymentIntent && paymentIntent.available_plans.length > 0 && <Card.Body className='border-top'>
      <h5>Pago a meses sin intereses</h5>

      <ButtonGroup>
        <Button variant='outline-secondary' disabled={status === 'success'} onClick={() => setSelectedPlan(undefined)} active={selectedPlan === undefined}>1 MSI</Button>
        {paymentIntent.available_plans.map((plan) => {
          if (plan.count > 12) return

          return <Button
            key={`plan-type-${plan.count}`}
            variant='outline-secondary'
            disabled={status === 'success'}
            onClick={() => setSelectedPlan(plan)} active={selectedPlan?.count === plan.count}>
              {plan.count} MSI
          </Button>
        })}
      </ButtonGroup>
    </Card.Body>}

    {!showForm && paymentIntent && paymentIntent.available_plans.length === 0 && <Card.Body className='border-top'>
      <p>
        Pago a meses sin intereses no disponible.&nbsp;
        <OverlayTrigger trigger={['hover', 'focus']} placement='bottom' overlay={popover}>
          <a href='#'>Consulta las tarjetas participantes.</a>
        </OverlayTrigger>
      </p>
    </Card.Body>}

    <Card.Body className='border-top'>
      <h5>Resumen</h5>

      <dl className="dlist-align">
        <dt>Total:</dt>
        <dd className="h5">{NumberUtils.toMoney(amountInCurrency, 2)}</dd>
      </dl>

      {selectedPlan && <dl className="dlist-align">
        <dt>{selectedPlan.count} pagos de:</dt>
        <dd className="h5">{NumberUtils.toMoney(amountInCurrency / selectedPlan.count, 2)}</dd>
      </dl>}

      <hr />

      <Button variant={submitIntent[status]} className='btn-block btn-lg' disabled={status === 'working'} onClick={handleSubmitCheckout}>
        {status === 'pending' && "Pagar"}
        {status === 'working' && <span><i className='fa fa-crosshairs fa-spin fa-lg' /> Procesando...</span>}
        {status === 'success' && <span><i className='fa fa-check-circle' /> {"¡Pago exitoso!"}</span>}
        {status === 'failed' && <span><i className='fa fa-times-circle' /> {"Pago Rechazado"}</span>}
      </Button>

      {status === 'working' && <div style={{ fontSize: '12px', marginTop: '10px', fontStyle: 'italic'}}>Estamos procesando tu método de pago, por favor no refresques ni abandones la pagina.</div>}
      {status === 'failed' && <div style={{ fontSize: '12px', marginTop: '10px', fontStyle: 'italic', color: 'red'}}>
        {errors.map((error: string) => <p>{error}</p>)}
      </div>}
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
  status: PaymentStatus
}

function PaymentMethodsTable (props: PaymentMethodsTableProps) {
  const { defaultSource, paymentMethods, onDisplayForm, onPaymentMethodSelected, status } = props

  const selectedPaymentMethod = find(paymentMethods, { stripe_id: defaultSource })

  if (!selectedPaymentMethod) return <></>

  return <div>
    <Dropdown>
      <Dropdown.Toggle variant='outline-dark' className='btn-block' disabled={status === 'success'}>
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
