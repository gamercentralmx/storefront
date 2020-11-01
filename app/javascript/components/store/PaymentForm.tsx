import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { CardElement, injectStripe, ReactStripeElements } from 'react-stripe-elements'
import PaymentMethods from 'repositories/PaymentMethods'

interface Props {
  onPaymentMethodAdded: (card: any) => void
  stripe?: ReactStripeElements.StripeProps
}

function PaymentForm (props: Props) {
  const { stripe, onPaymentMethodAdded } = props
  const [name, setName] = useState('')
  const [working, setWorking] = useState(false)
  const [errored, setErrored] = useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget

    setName(value)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (stripe === undefined) return

    setWorking(true)

    let { token } = await stripe.createToken({ name })

    if (token === undefined) {
      setErrored(true)

      return
    }

    const paymentMethod = await PaymentMethods.save(token)

    onPaymentMethodAdded(paymentMethod)
  }

  return <Form onSubmit={handleSubmit}>
    <Form.Group>
      <Form.Label>Nombre <small>(como esta escrito en la tarjeta)</small></Form.Label>
      <Form.Control onChange={handleChange}></Form.Control>
    </Form.Group>

    <Form.Group>
      <Form.Label>Datos de la tarjeta</Form.Label>

      <CardElement className='form-control' style={{ base: { lineHeight: '1.429' }}} />
    </Form.Group>

    <Button variant='primary' className='btn-block' type='submit' disabled={working}>Agregar Tarjeta</Button>
  </Form>
}

export default injectStripe(PaymentForm);
