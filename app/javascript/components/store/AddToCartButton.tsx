import { Product } from 'definitions/Product'
import React, { useState } from 'react'
import { Button, Toast } from 'react-bootstrap'
import CartRepository from 'repositories/CartRepository'

interface Props {
  product: Product
}

export default function AddToCartButton (props: Props) {
  const { product } = props
  const [stock, setStock] = useState(product.stock)
  const [showError, setShowError] = useState(false)

  const hasStock = stock > 0
  const label = hasStock ? "Agregar al carrito" : "Producto agotado"
  const icon = hasStock ? 'shopping-cart' : 'times-circle'
  const variant = hasStock ? 'success' : 'secondary'

  const handleAddtoCart = async () => {
    try {
      await CartRepository.add(product.id)

      location.href = '/carrito'
    } catch (error) {
      console.error(error)

      setShowError(true)
      setStock(error.responseJSON.stock)
    }
  }

  return <>
    <Button className='ml-1' disabled={!hasStock} variant={variant} onClick={handleAddtoCart}>
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
