import React from "react"
import { find } from "lodash"
import { Dropdown } from "react-bootstrap"
import { PaymentMethod } from "definitions/PaymentMethod"
import { PaymentStatus } from "definitions/PaymentStatus"
import FormattedPaymentMethod from "./FormattedPaymentMethod"

interface Props {
  defaultSource: string
  paymentMethods: PaymentMethod[]
  onDisplayForm: () => void
  onPaymentMethodSelected: (paymentMethod: PaymentMethod) => void
  status: PaymentStatus
}

export default function PaymentMethodsDropdown (props: Props) {
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
