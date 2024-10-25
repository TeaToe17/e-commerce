import React, { useContext, useEffect, useState } from "react";
import Order from "../components/Order";
import { ProductContext } from "../ProductContext";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import api from "../api";

function UserOrders() {
  const { selectedProduct, orders } = useContext(ProductContext);
  const [quantities, setQuantities] = useState({});
  const [localOrders, setLocalOrders] = useState([]);
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); 
  const [showPayment, setShowPayment] = useState(false); // Toggle for payment section

  const stripe = useStripe();
  const elements = useElements();

  const handleCheckoutClick = () => {
    setShowPayment(true); // Display payment form on checkout
  };

  const manageCheckout = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    const orderProducts = localOrders.reduce((acc, order) => {
      acc[order.id] = quantities[order.id] || 1; 
      return acc;
    }, {});

    try {
      const orderResponse = await api.post("/order/create/", {
        products: orderProducts,
        contact: contact,
        address: address,
      });

      const orderId = orderResponse.data.order_id;

      const paymentResponse = await api.post("/order/createpaymentintent/", { order_id: orderId });
      const { clientSecret, setupIntent } = paymentResponse.data;

      if (setupIntent) {
        const result = await stripe.confirmCardSetup(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
          }
        });
        if (result.error) {
          setErrorMessage(result.error.message);
        } else {
          setSuccessMessage("Payment method saved successfully!");
        }
      } else {
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
          }
        });
        if (result.error) {
          setErrorMessage(result.error.message);
        } else {
          setSuccessMessage("Order created and payment completed successfully!");
        }
      }

      setContact("");
      setAddress("");
      setLocalOrders([]); 
      localStorage.removeItem("orders"); 
    } catch (err) {
      setErrorMessage("Error creating order or payment");
      console.log(err.message);
    }
  };

  useEffect(() => {
    setLocalOrders(orders);
    const storedOrders = localStorage.getItem("orders");
    if (storedOrders) {
      setLocalOrders(JSON.parse(storedOrders));
    }
  }, [orders]);

  useEffect(() => {
    if (selectedProduct) {
      setLocalOrders(selectedProduct);
      localStorage.setItem("orders", JSON.stringify(selectedProduct));
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (localOrders.length > 0) {
      const initialQuantities = {};
      localOrders.forEach((order) => {
        initialQuantities[order.id] = 1; 
      });
      setQuantities(initialQuantities);
    }
  }, [localOrders]);

  const updateQuantity = (productId, delta) => {
    setQuantities((prevQuantities) => {
      const newQuantities = { ...prevQuantities };
      newQuantities[productId] = Math.max(
        1,
        (newQuantities[productId] || 1) + delta
      );
      return newQuantities;
    });
  };

  return (
    <div>
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {localOrders.length > 0 ? (
        localOrders.map((order, index) => (
          <div key={index}>
            <Order product={order} quantity={quantities[order.id] || 1} />
            <button onClick={() => updateQuantity(order.id, -1)}>-</button>
            <button onClick={() => updateQuantity(order.id, 1)}>+</button>
          </div>
        ))
      ) : (
        <p>No products selected</p>
      )}

      <button onClick={handleCheckoutClick}>Proceed to Checkout</button>

      {showPayment && (
        <form onSubmit={manageCheckout}>
          <input
            type="text"
            value={contact}
            placeholder="Contact"
            onChange={(e) => setContact(e.target.value)}
          />
          <input
            type="text"
            value={address}
            placeholder="Set delivery address"
            onChange={(e) => setAddress(e.target.value)}
          />
          <CardElement />
          <button type="submit" disabled={!stripe}>Checkout</button>
        </form>
      )}
    </div>
  );
}

export default UserOrders;
