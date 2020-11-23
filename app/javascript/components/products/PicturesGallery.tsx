import React, { useState } from 'react'
import { Product } from 'definitions/Product'
import { Modal } from 'react-bootstrap'

interface Props {
  product: Product
}

export default function PicturesGallery (props: Props) {
  const { product } = props
  const [currentPicture, setCurrentPicture] = useState(product.pictures[0] || '/assets/gunslinger.jpg')
  const [showModal, setShowModal] = useState(false)

  const handleShowModal = () => setShowModal(true)
  const handleCloseModal = () => setShowModal(false)

  return <>
    <article className="gallery-wrap">
      <div className="img-big-wrap">
        <a><img src={currentPicture} onClick={handleShowModal}/></a>
      </div>

      {product.pictures.length > 0 && <div className="thumbs-wrap">
        {product.pictures.map((picture: string) => {
          return <a className="item-thumb" onClick={() => setCurrentPicture(picture)}> <img src={picture} /></a>
        })}
      </div>}
    </article>

    <Modal show={showModal} onHide={handleCloseModal} size='lg'>
      <Modal.Header closeButton>
        <Modal.Title>{product.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <article className="gallery-wrap">
          <div className="img-big-wrap">
            <a><img src={currentPicture} onClick={handleShowModal}/></a>
          </div>

          {product.pictures.length > 0 && <div className="thumbs-wrap">
            {product.pictures.map((picture: string) => {
              return <a className="item-thumb" onClick={() => setCurrentPicture(picture)}> <img src={picture} /></a>
            })}
          </div>}
        </article>
      </Modal.Body>
    </Modal>
  </>
}
