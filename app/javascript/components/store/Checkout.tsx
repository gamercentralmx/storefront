import React from 'react'
import { Col } from 'react-bootstrap'
import { StripeProvider, Elements } from 'react-stripe-elements'
import PaymentForm from './PaymentForm'

declare global {
  interface Window { stripeApiKey: string }
}

export default function Checkout () {
  const handlePaymentMethod = (paymentMethod: any) => {
    console.log(paymentMethod)
  }

  return <div>
    <Col sm='6'>
      <StripeProvider apiKey={window.stripeApiKey}>
        <div className='example'>
          <Elements>
            <PaymentForm onPaymentMethodAdded={handlePaymentMethod} />
          </Elements>
        </div>
      </StripeProvider>
    </Col>
  </div>
}
