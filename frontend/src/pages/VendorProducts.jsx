import React, { useContext, useEffect, useState } from "react";
import api from "../api";
import { ProductContext } from "../ProductContext";

function VendorProducts() {
  const [products, setProducts] = useState(() => {
    const data = localStorage.getItem("products");
    try {
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error parsing products from localStorage", e);
      return [];
    }
  });

  const [localVendor, setLocalVendor] = useState(() => {
    const data = localStorage.getItem("vendor");
    return data ? JSON.parse(data) : null;
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { vendor, setVendor } = useContext(ProductContext);
  
  // States for creating a product
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState(null);

  // States for updating a product
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const createProduct = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("image", image);
    formData.append("vendor", vendor.id);

    api.post("/vendor/product/create/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      setErrorMessage("");
      setSuccessMessage("Product created successfully!");
      setProducts([...products, response.data]);
      localStorage.setItem("products", JSON.stringify([...products, response.data]));
      resetForm();
    })
    .catch((error) => {
      setSuccessMessage("");
      setErrorMessage("Error, try again later.");
      console.error(error);
    });
  };

  const startEditProduct = (product) => {
    setCurrentProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setStock(product.stock);
    setImage(null); // Reset image for edit mode
    setEditMode(true);
  };

  const updateProduct = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("vendor", vendor.id);

    if (image) {
      formData.append("image", image);
    }

    api.put(`/vendor/product/update/${currentProduct.id}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      setSuccessMessage("Product updated successfully!");
      const updatedProducts = products.map((product) =>
        product.id === currentProduct.id ? response.data : product
      );
      setProducts(updatedProducts);
      localStorage.setItem("products", JSON.stringify(updatedProducts));
      resetForm();
    })
    .catch((err) => {
      console.error(err.response ? err.response.data : err);
      setErrorMessage("Failed to update product.");
    });
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setStock("");
    setImage(null);
    setEditMode(false);
    setCurrentProduct(null);
  };

  const deleteProduct = (productId) => {
    api.delete(`/vendor/product/delete/${productId}/`)
      .then(() => {
        setSuccessMessage("Product deleted successfully!");
        const filteredProducts = products.filter((product) => product.id !== productId);
        setProducts(filteredProducts);
        localStorage.setItem("products", JSON.stringify(filteredProducts));
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage("Failed to delete product.");
      });
  };

  useEffect(() => {
    const savedVendor = localStorage.getItem("vendor");
    if (savedVendor) {
      setVendor(JSON.parse(savedVendor));
    } else {
      setError("No vendor data available.");
    }
  }, []);

  useEffect(() => {
    if (vendor && vendor.customer && vendor.customer.user) {
      localStorage.setItem("vendor", JSON.stringify(vendor));
      setLocalVendor(vendor);
      api.get("/product/list/")
        .then((res) => {
          const vendorProducts = res.data.filter((prod) => prod.vendor === vendor.id);
          setProducts(vendorProducts);
          localStorage.setItem("products", JSON.stringify(vendorProducts));
        })
        .catch((err) => {
          setError(err.res);
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [vendor]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading products, refresh page: {error.message}</div>;
  }

  return (
    <div className="">
      <h2>Products for Vendor</h2>
      <div className="flex flex-wrap">
        {products.map((product) => (
          <div
            key={product.id}
            className="p-2 border-none flex bg-white rounded-lg hover:shadow-lg cursor-pointer transition-shadow duration-300 "
          >
            <div className="text-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-40 h-40 object-cover rounded-md mb-4"
              />
              <p className="text-lg font-semibold text-gray-800 mb-2">
                {product.name}
              </p>
              <p className="text-md font-bold text-green-600">
                ${product.price}
              </p>
              <button onClick={() => startEditProduct(product)}>Update</button>
              <button onClick={() => deleteProduct(product.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <form onSubmit={editMode ? updateProduct : createProduct}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="text"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        {image && (
          <div>
            <p>{image.name}</p>
            <img
              src={URL.createObjectURL(image)}
              alt="Selected Preview"
              className="w-40 h-40 object-cover rounded-md"
            />
            <button type="button" onClick={() => setImage(null)}>
              Remove
            </button>
          </div>
        )}
        <button type="submit">{editMode ? "Update Product" : "Submit"}</button>
      </form>
    </div>
  );
}

export default VendorProducts;
