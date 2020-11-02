import ErrorBoundary from 'components/ErrorBoundary'
import React from 'react'
import Checkout from './Checkout'

interface Props {
  defaultSource: string
  amount: number
}


export default function SafeCheckout (props: Props) {
  return <ErrorBoundary>
    <Checkout {...props} />
  </ErrorBoundary>
}
