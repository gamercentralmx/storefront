import React from "react"
import StringUtils from "helpers/StringUtils"
import { PaymentMethod } from "definitions/PaymentMethod"


interface Props {
  paymentMethod: PaymentMethod
}

export default function FormattedPaymentMethod (props: Props) {
  const { paymentMethod } = props
  const { name, brand, last4, exp_month, exp_year } = paymentMethod.metadata

  return <>
    {StringUtils.truncate(name, 15)} &nbsp; <i className={`fab fa-cc-${brand.toLowerCase()}`}></i> **** {last4} - {exp_month}/{exp_year}
  </>
}
