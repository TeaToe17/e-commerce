import React, { useEffect, useState } from "react";
import api from "../api";
import Product from "../components/Product";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate()
  const [products, setProducts] = useState(null);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = () => {
    api
      .get("/product/list/")
      .then((res) => setProducts(res.data))
      .catch((error) => alert(error));
  };

  const viewProduct = (productId) => {
    navigate(`/product_page/${productId}/`)
  };

  return (
    <div className="p-3" >
      {products ? 
        <div className="flex flex-wrap w-full" >
          {products.map((product) => (
            <div key={product.id} className=" flex w-[25%]"><Product product={product} viewProduct={()=>viewProduct(product.id)} /></div>
          ))}
        </div>
       : (
        <p>No Products Yet</p>
      )}
    </div>
  );
}

export default Home;
