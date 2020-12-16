import { Product } from 'definitions/Product'
import React, { useState } from 'react'
import { Button, OverlayTrigger, Toast, Tooltip } from 'react-bootstrap'
import CartRepository from 'repositories/CartRepository'

interface Props {
  product: Product
  additionalClasses?: string
  onlyIcon?: boolean
}

export default function AddToCartButton (props: Props) {
  const { product, additionalClasses, onlyIcon = false } = props
  const [stock, setStock] = useState(product.stock)
  const [showError, setShowError] = useState(false)

  const hasStock = stock > 0
  const label = hasStock ? "Agregar al carrito" : "Producto agotado"
  const icon = hasStock ? 'shopping-cart' : 'times-circle'
  const variant = hasStock ? 'success' : 'secondary'

  const handleAddtoCart = async () => {
    try {
      await CartRepository.add(product.id)

      if (onlyIcon) {
        location.reload()
      } else {
        location.href = '/carrito'
      }

    } catch (error) {
      console.error(error)

      setShowError(true)
      setStock(error.responseJSON.stock)
    }
  }

  if (onlyIcon) {
    return <CompactButton
      additionalClasses={additionalClasses}
      hasStock={hasStock}
      variant={variant}
      label={label}
      onClick={handleAddtoCart}
      icon={icon}
      showError={showError} />
  }

  return <>
    <Button
      className={`ml-1 ${additionalClasses}`}
      disabled={!hasStock}
      variant={variant}
      onClick={handleAddtoCart}>

      <span className='text'>{label}</span>
      <i className={`icon fas fa-${icon}`} />
    </Button>

    {showError && <p>
      <small className='text-error'>
        <i className='fa fa-exclamation-circle' /> El producto se encuentra agotado.
      </small>
    </p>}
  </>
}

interface CompactButtonProps {
  hasStock: boolean
  variant: string
  onClick: () => void
  icon: string
  showError: boolean
  additionalClasses: string
  label: string
}

function CompactButton (props: CompactButtonProps) {
  const { hasStock, variant, onClick, icon, additionalClasses, showError, label } = props

  const newVariant = showError ? 'danger' : variant

  const tooltip = <Tooltip id={`checkout-button-tooltip`}>{label}</Tooltip>

  return <>
    <OverlayTrigger placement='top' overlay={tooltip}>
      <Button
        className={`ml-1 ${additionalClasses}`}
        disabled={!hasStock}
        variant={newVariant}
        onClick={onClick}>

        <i className={`icon fas fa-${icon}`} />
      </Button>
    </OverlayTrigger>
  </>
}
