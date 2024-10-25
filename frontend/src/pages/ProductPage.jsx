import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ProductContext } from "../ProductContext"; // Import context

function ProductPage() {
  const { productId } = useParams();
  const {
    product,
    setProductId,
    selectedProduct,
    orders,
    managecart,
  } = useContext(ProductContext); 

  const selected = selectedProduct.some((prod) => prod.id === parseInt(productId));

  useEffect(() => {
    setProductId(productId); 
  }, [productId, setProductId]);

  return (
    <div className="p-3" >
      {product && (
        <div>
          <div>
            <div className="flex gap-2" >
                <div >
                  <img className="h-[140px]" src={product.image} alt={product.name} />
                  <img className="h-[140px]" src={product.image} alt={product.name} />
                  <img className="h-[140px]" src={product.image} alt={product.name} />
                  <img className="h-[140px]" src={product.image} alt={product.name} />
                </div>
                <div>
                  <img className="h-[560px] rounded-md" src={product.image} alt={product.name} />
                </div>
            </div>
              <p className="text-4xl py-3 mx-[300px] " >{product.name}</p>
          </div>
          <p>{product.description}</p>
          <p>{product.price}</p>
          <button onClick={() => managecart(product)}>
            {selected ? "Remove from Cart" : "Add to Cart"}
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductPage;
