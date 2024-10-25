import React from 'react'

function Order({product,quantity}) {
    // console.log(product)
  return (
    <div>
        <img src={product.image} ></img>
        <p>{product.price}</p>
        <p>{quantity}</p>
    </div>
  )
}

export default Order