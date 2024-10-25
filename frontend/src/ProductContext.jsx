import React, { createContext, useState, useEffect } from "react";
import api from "./api";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [product, setProduct] = useState(null);
  const [productId, setProductId] = useState(null);
  const [vendor,setVendor] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(() => {
    const storedProducts = localStorage.getItem('selectedProducts');
    return storedProducts ? JSON.parse(storedProducts) : [];
  });
  // const [orders, setOrders] = useState(selectedProduct.length);
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    if (productId) {
      api.get("/product/list/")
        .then((res) => {
          const filteredProduct = res.data.find(
            (prod) => prod.id === parseInt(productId)
          );
          if (filteredProduct) {
            setProduct(filteredProduct);
          }
        })
        .catch((error) => alert(error));
    }
  }, [productId]);

  const managecart = (product) => {
    if (!selected) {
      const updatedProducts = [...selectedProduct, product];
      setSelectedProduct(updatedProducts);
      localStorage.setItem('selectedProducts', JSON.stringify(updatedProducts)); // Persist to local storage
    } else {
      const updatedProducts = selectedProduct.filter(
        (prod) => prod.id !== product.id
      );
      setSelectedProduct(updatedProducts);
      localStorage.setItem('selectedProducts', JSON.stringify(updatedProducts)); // Update local storage
    }
    setSelected(!selected);
  };

  useEffect(() => {
    setOrders(selectedProduct)
    console.log(selectedProduct)
  }, [orders]);

  const value = {
    product,
    productId,
    setProductId,
    selectedProduct,
    orders,
    setOrders,
    selected,
    setSelected,
    managecart,
    vendor,
    setVendor,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};
