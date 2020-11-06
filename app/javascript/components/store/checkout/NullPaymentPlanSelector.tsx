import React from "react"
import { OverlayTrigger, Popover } from "react-bootstrap"
import { PaymentIntent } from "definitions/PaymentIntent"

interface Props {
  showForm: boolean
  paymentIntent?: PaymentIntent
}

export default function NullPaymentPlanSelector (props: Props) {
  const {
    showForm,
    paymentIntent
  } = props

  if (showForm || (paymentIntent && paymentIntent.payment_method_options.card.installments.available_plans.length > 0)) return <></>

  const popover = (
    <Popover id="popover-basic">
      <Popover.Title as="h3">Tarjetas Participantes a meses sin intereses</Popover.Title>
      <Popover.Content>
        <ul>
          <li>Afirme</li>
          <li>American Express</li>
          <li>BanBajío</li>
          <li>Banca Mifel</li>
          <li>Banco Azteca</li>
          <li>Banco Famsa</li>
          <li>Banco Invex</li>
          <li>Banjercito</li>
          <li>Banorte</li>
          <li>Banregio</li>
          <li>BBVA</li>
          <li>Citibanamex</li>
          <li>HSBC</li>
          <li>Inbursa</li>
          <li>Liverpool</li>
          <li>Santander</li>
          <li>Scotiabank</li>
        </ul>
      </Popover.Content>
    </Popover>
  )

  return <>
    <p>
      Pago a meses sin intereses no disponible.&nbsp;
      <OverlayTrigger trigger={['hover', 'focus']} placement='bottom' overlay={popover}>
        <a href='#'>Consulta las tarjetas participantes.</a>
      </OverlayTrigger>
    </p>
  </>
}
