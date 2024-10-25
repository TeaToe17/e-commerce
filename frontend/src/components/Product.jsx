import React from "react";

function Product({ product, viewProduct }) {
  return (
    <div
      className="p-2 border-none w-full bg-white rounded-lg hover:shadow-lg cursor-pointer transition-shadow duration-300 "
      onClick={() => viewProduct(product)}
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-70 object-cover rounded-md mb-4"
      />
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-800 mb-2">{product.name}</p>
        <p className="text-md font-bold text-green-600">${product.price}</p>
      </div>
    </div>
  );
}

export default Product;
 