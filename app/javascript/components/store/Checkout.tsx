import { PaymentMethod } from 'definitions/PaymentMethod'
import StringUtils from 'helpers/StringUtils'
import { find } from 'lodash'
import React, { useEffect, useState } from 'react'
import { Form, Col, Table, Button, Dropdown } from 'react-bootstrap'
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
  const [defaultSource, setDefaultSource] = useState(props.defaultSource)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [showForm, setShowForm] = useState(false)

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

  return <div>
    <h5>Método de pago</h5>
    {showForm && <StripeForm onPaymentMethodAdded={handlePaymentMethod} onClose={() => setShowForm(false)} />}
    {!showForm && <PaymentMethodsTable defaultSource={defaultSource} paymentMethods={paymentMethods} onDisplayForm={() => setShowForm(true)} onPaymentMethodSelected={handlePaymentMethodSelected} />}
  </div>
}

interface StripeFormProps {
  onPaymentMethodAdded: (paymentMethod: PaymentMethod) => void
  onClose: () => void
}

function StripeForm (props: StripeFormProps) {
  const { onPaymentMethodAdded, onClose } = props

  return <StripeProvider apiKey={window.stripeApiKey}>
    <div className='example'>
      <Elements>
        <PaymentForm onPaymentMethodAdded={onPaymentMethodAdded} onClose={onClose} />
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
          return <Dropdown.Item onClick={() => onPaymentMethodSelected(paymentMethod)} active={selectedPaymentMethod.id === paymentMethod.id}>
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
