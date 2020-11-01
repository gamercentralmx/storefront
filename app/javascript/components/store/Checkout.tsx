import { PaymentMethod } from 'definitions/PaymentMethod'
import React, { useEffect, useState } from 'react'
import { Form, Col, Table, Button } from 'react-bootstrap'
import { StripeProvider, Elements } from 'react-stripe-elements'
import PaymentMethodsRepository from 'repositories/PaymentMethodsRepository'
import PaymentForm from './PaymentForm'

declare global {
  interface Window { stripeApiKey: string }
}

interface Props {
  defaultSource: string
}

export default function Checkout (props: Props) {
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
    <Col sm='6'>
      {showForm && <StripeForm onPaymentMethodAdded={handlePaymentMethod} />}
      {!showForm && <PaymentMethodsTable defaultSource={defaultSource} paymentMethods={paymentMethods} onDisplayForm={() => setShowForm(true)} onPaymentMethodSelected={handlePaymentMethodSelected} />}
    </Col>
  </div>
}

interface StripeFormProps {
  onPaymentMethodAdded: (paymentMethod: PaymentMethod) => void
}

function StripeForm (props: StripeFormProps) {
  const { onPaymentMethodAdded } = props

  return <StripeProvider apiKey={window.stripeApiKey}>
    <div className='example'>
      <Elements>
        <PaymentForm onPaymentMethodAdded={onPaymentMethodAdded} />
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

  return <div>
    <Table striped={true} size='sm'>
      <thead>
        <tr>
          <th></th>
          <th>Nombre</th>
          <th>Terminación</th>
          <th>Expira</th>
        </tr>
      </thead>
      <tbody>
        {paymentMethods.map((paymentMethod) => {
          return <tr key={`payment-method-${paymentMethod.id}`}>
            <td><Form.Check type='radio' value={paymentMethod.id} name='selectCard' defaultChecked={defaultSource === paymentMethod.stripe_id} onClick={() => onPaymentMethodSelected(paymentMethod)} /></td>
            <td>{paymentMethod.metadata.name}</td>
            <td>
              <i className={`fab fa-cc-${paymentMethod.metadata.brand.toLowerCase()}`}></i> **** {paymentMethod.metadata.last4}
            </td>
            <td>{paymentMethod.metadata.exp_month}/{paymentMethod.metadata.exp_year}</td>
          </tr>
        })}
      </tbody>
    </Table>

    <Button variant='primary' onClick={() => onDisplayForm()}>Agregar nueva tarjeta</Button>
  </div>
}
