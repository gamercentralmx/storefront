import React from 'react'
import { Elements, StripeProvider } from 'react-stripe-elements'
import { PaymentMethod } from 'definitions/PaymentMethod'
import PaymentForm from './PaymentForm'

interface Props {
  onPaymentMethodAdded?: (paymentMethod: PaymentMethod) => void
  onClose?: () => void
  hasPaymentMethods?: boolean
}


export default function NewPaymentForm (props: Props) {
  const {
    onPaymentMethodAdded = () => location.href = '/payment_methods',
    onClose = () => location.href = '/payment_methods',
    hasPaymentMethods
  } = props

  return <StripeProvider apiKey={window.stripeApiKey}>
    <div className='example'>
      <Elements>
        <PaymentForm
          onClose={onClose}
          onPaymentMethodAdded={onPaymentMethodAdded}
          hasPaymentMethods={hasPaymentMethods} />
      </Elements>
    </div>
  </StripeProvider>
}
