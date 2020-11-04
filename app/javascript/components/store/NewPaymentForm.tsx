import React from 'react'
import { Elements, StripeProvider } from 'react-stripe-elements'
import PaymentForm from './PaymentForm'

export default function NewPaymentForm () {
  return <StripeProvider apiKey={window.stripeApiKey}>
    <div className='example'>
      <Elements>
        <PaymentForm
          onClose={() => location.href = '/payment_methods'}
          onPaymentMethodAdded={() => location.href = '/payment_methods'}
          hasPaymentMethods={true} />
      </Elements>
    </div>
  </StripeProvider>
}
