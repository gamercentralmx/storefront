import React from 'react'
import { Button } from 'react-bootstrap'
import { PaymentStatus } from 'definitions/PaymentStatus'

const submitIntent = {
  pending: 'primary',
  working: 'primary',
  success: 'success',
  failed: 'danger'
}

interface Props {
  status: PaymentStatus
  errors: string[]
  onSubmit: () => void
}

const subtextStyle = { fontSize: '12px', marginTop: '10px', fontStyle: 'italic' }

export default function Submit (props: Props) {
  const { status, errors, onSubmit } = props

  return <>
    <Button variant={submitIntent[status]} className='btn-block btn-lg' disabled={status === 'working'} onClick={onSubmit}>
      {status === 'pending' && 'Pagar'}
      {status === 'working' && <span><i className='fa fa-crosshairs fa-spin fa-lg' /> Procesando...</span>}
      {status === 'success' && <span><i className='fa fa-check-circle' /> {'¡Pago exitoso!'}</span>}
      {status === 'failed' && <span><i className='fa fa-times-circle' /> {'Pago Rechazado'}</span>}
    </Button>

    {status === 'working' && <div style={subtextStyle}>
      Estamos procesando tu método de pago, por favor no refresques ni abandones la pagina.
    </div>}

    {status === 'failed' && <div style={{ ...subtextStyle, color: 'red' }}>
      {errors.map((error: string, index: number) => <p key={`error-${index}-${error}`}>{error}</p>)}
    </div>}
  </>
}
