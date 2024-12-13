import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../sidebar";

const Payment = () => {
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    // Dynamically load the PayPal script
    const script = document.createElement("script");
    script.src = "https://www.paypal.com/sdk/js?client-id=AasBE41jco_SD_cOslD07xD_sBSoZRinvpsKsvgqJqk9XU_nGu4hO-tspC1dLWFMy5Hj6d7bJLl_dvMS";
    script.type = "text/javascript";
    script.async = true;
    script.onload = () => {
      if (window.paypal) {
        window.paypal.Buttons({
          // Customize the button options if needed
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: "10.00", // Replace with dynamic amount
                  },
                },
              ],
            });
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then((details) => {
              alert(`Transaction completed by ${details.payer.name.given_name}`);
              console.log("Transaction Details:", details);
            });
          },
          onError: (err) => {
            console.error("PayPal Checkout Error:", err);
          },
        }).render("#paypal-button-container");
      }
    };
    document.body.appendChild(script);
  }, []);

  return (
    
    <div>
      <h3>Payment</h3>
    
      <div id="paypal-button-container"></div>
      <button
        onClick={() => navigate(-1)} // Go back to the previous page
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Go Back
      </button>
    </div>
  );
};

export default Payment;
