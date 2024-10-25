import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // Assuming Axios is setup
import { ProductContext } from "../ProductContext"; // Assuming this manages vendor state
import { useStripeConnect } from "../useStripeConnect";
import {
  ConnectAccountOnboarding,
  ConnectComponentsProvider,
} from "@stripe/react-connect-js";

function VendorRegister() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [isVendor, setIsVendor] = useState(false);
  const { vendor, setVendor } = useContext(ProductContext);
  const [storeName, setStoreName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connectedAccountId, setConnectedAccountId] = useState("");
  const [onboardingExited, setOnboardingExited] = useState(false);
  const stripeConnectInstance = useStripeConnect(connectedAccountId);
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    api
      .post("/vendor/account/", {
        store_name: storeName,
        contact: contact,
        email: email,
        customer: customer?.id,
      })
      .then((res) => {
        const vendorData = res.data;
        setVendor(vendorData);
        setConnectedAccountId(vendorData.stripe_account_id);
        localStorage.setItem("vendorData", JSON.stringify(vendorData)); // Save to localStorage
        navigate("/vendorproducts"); // Automatically navigate to vendor products
      })
      .catch((err) => {
        setError("Error creating vendor or Stripe account.");
        console.log(err.response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    // Check if vendor data exists in localStorage
    const storedVendorData = localStorage.getItem("vendorData");
    if (storedVendorData) {
      const parsedData = JSON.parse(storedVendorData);
      setVendor(parsedData);
      setConnectedAccountId(parsedData.stripe_account_id);
      setIsVendor(true);
      navigate("/vendorproducts"); // Automatically navigate if vendor is already registered
    } else {
      // Fetch customer profile if no vendor data in localStorage
      api
        .get("/customer/profile/")
        .then((res) => {
          setLoggedInUser(res.data.user);
          setCustomer(res.data);
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    }
  }, []);

  useEffect(() => {
    if (loggedInUser && !isVendor) {
      api
        .get("/vendor/list/")
        .then((res) => {
          setVendors(res.data);
          const foundVendor = res.data.find(
            (vendor) => vendor.customer.user.id === loggedInUser.id
          );
          if (foundVendor) {
            setVendor(foundVendor);
            localStorage.setItem("vendorData", JSON.stringify(foundVendor)); // Update localStorage
            navigate("/vendorproducts");
          }
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    }
  }, [loggedInUser, setVendor]);

  useEffect(() => {
    if (onboardingExited) {
      navigate("/vendorproducts");
    }
  }, [onboardingExited, navigate]);

  return (
    <div>
      <h2>Vendor Register</h2>
      {loggedInUser && (
        <div>
          <form onSubmit={handleRegister}>
            <h3>Welcome, {loggedInUser.username}</h3>
            <input
              type="text"
              placeholder="Store Name"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Submit"}
            </button>
            {error && <p className="error">{error}</p>}
          </form>

          {connectedAccountId && stripeConnectInstance && (
            <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
              <ConnectAccountOnboarding
                onExit={() => setOnboardingExited(true)}
              />
            </ConnectComponentsProvider>
          )}

          {onboardingExited && (
            <p>The Account Onboarding process has exited.</p>
          )}

          {connectedAccountId && (
            <div className="dev-callout">
              <p>
                Your connected Stripe account ID is:{" "}
                <code className="bold">{connectedAccountId}</code>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default VendorRegister;
