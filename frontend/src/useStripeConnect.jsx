import { useState, useEffect } from "react";
import { loadConnectAndInitialize } from "@stripe/connect-js";
import api from "./api";

export const useStripeConnect = (connectedAccountId) => {
  const [stripeConnectInstance, setStripeConnectInstance] = useState();

  useEffect(() => {
    if (connectedAccountId) {
      const fetchClientSecret = async () => {
        try {
          const res = await api.post("/vendor/account_session/", {
            account: connectedAccountId,
          });
    
          console.log(res.data); // Log to check the data
          const { client_secret: clientSecret } = res.data;
    
          // Ensure that clientSecret is returned properly
          if (clientSecret) {
            return clientSecret;
          } else {
            throw new Error("Client secret not found");
          }
        } catch (err) {
          console.error("Error fetching client secret:", err);
          throw err;
        }
      };
    
      // Set the Stripe connect instance with the correct client secret
      setStripeConnectInstance(
        loadConnectAndInitialize({
          publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
          fetchClientSecret,
          appearance: {
            overlays: "dialog",
            variables: {
              colorPrimary: "#635BFF",
            },
          },
        })
      );
    }
    
  }, [connectedAccountId]);

  return stripeConnectInstance;
};

export default useStripeConnect;
