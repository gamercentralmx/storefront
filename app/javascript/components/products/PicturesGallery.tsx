import React, { useState } from 'react'
import { Product } from 'definitions/Product'
import Zoom from 'react-medium-image-zoom'

interface Props {
  product: Product
}

export default function PicturesGallery (props: Props) {
  const { product } = props
  const [currentPicture, setCurrentPicture] = useState(product.pictures[0] || '/assets/gunslinger.jpg')

  return <>
    <article className="gallery-wrap">
      <div className="img-big-wrap" style={{ textAlign: 'center' }}>
        <Zoom>
          <img src={currentPicture} />
        </Zoom>
      </div>

      {product.pictures.length > 0 && <div className="thumbs-wrap">
        {product.pictures.map((picture: string, index: number) => {
          return <a className="item-thumb" key={`picture-${index}`} onClick={() => setCurrentPicture(picture)}> <img src={picture} /></a>
        })}
      </div>}
    </article>
  </>
}
