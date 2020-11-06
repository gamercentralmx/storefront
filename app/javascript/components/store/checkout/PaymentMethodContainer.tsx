import React, { useState } from 'react'
import { PaymentStatus } from 'definitions/PaymentStatus'
import NewPaymentForm from './NewPaymentForm'
import PaymentMethodsDropdown from './PaymentMethodsDropdown'
import { PaymentMethod } from 'definitions/PaymentMethod'

interface Props {
  onPaymentMethodAdded: (paymentMethod: PaymentMethod) => void
  onPaymentMethodSelected: (paymentMethod: PaymentMethod) => void
  onClose: () => void
  onOpen: () => void
  status: PaymentStatus
  paymentMethods: PaymentMethod[]
  defaultSource: string
  showForm: boolean
}

export default function PaymentMethodContainer (props: Props) {
  const {
    onPaymentMethodAdded,
    onPaymentMethodSelected,
    onOpen,
    onClose,
    paymentMethods,
    status,
    defaultSource,
    showForm
  } = props

  return <>
    <h5>Método de pago</h5>

    {showForm && <NewPaymentForm
      onPaymentMethodAdded={onPaymentMethodAdded}
      onClose={onClose}
      hasPaymentMethods={paymentMethods.length > 0} />}

    {!showForm && <PaymentMethodsDropdown
      defaultSource={defaultSource}
      paymentMethods={paymentMethods}
      onDisplayForm={onOpen}
      status={status}
      onPaymentMethodSelected={onPaymentMethodSelected} />}
  </>
}
