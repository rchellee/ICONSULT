import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!document.getElementById("paypal-sdk")) {
      const script = document.createElement("script");
      script.src = "https://www.paypal.com/sdk/js?client-id=AasBE41jco_SD_cOslD07xD_sBSoZRinvpsKsvgqJqk9XU_nGu4hO-tspC1dLWFMy5Hj6d7bJLl_dvMS";
      script.id = "paypal-sdk";
      script.async = true;
      script.onload = () => initializePayPalButtons();
      document.body.appendChild(script);
    } else {
      initializePayPalButtons();
    }

    return () => {
      // Clean up only the PayPal buttons, not the container
      const paypalButtons = document.getElementById("paypal-button-container");
      if (paypalButtons) {
        paypalButtons.innerHTML = ""; // Ensure no duplicate buttons are rendered
      }
    };
  }, []);

  const initializePayPalButtons = () => {
    if (window.paypal) {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: "15.00", // Replace with dynamic amount
                },
              },
            ],
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then((details) => {
            const clientId = localStorage.getItem("clientId"); // Retrieve clientId from localStorage (or state management)
            const transactionDetails = {
              transactionId: details.id,
              payerName: details.payer.name.given_name + " " + details.payer.name.surname,
              payerEmail: details.payer.email_address,
              amount: details.purchase_units[0].amount.value,
              currency: details.purchase_units[0].amount.currency_code,
              payedToEmail: "ritchelle.rueras@tup.edu.ph", // Replace with dynamic value if needed
              clientId, // Include clientId in the payment details
            };
            // Save transaction details to the database
            savePaymentDetails(transactionDetails);

            console.log("Transaction Details:", details);
            alert(`Transaction completed by ${transactionDetails.payerName}`);
          });
        },
        onError: (err) => {
          console.error("PayPal Checkout Error:", err);
        },
      }).render("#paypal-button-container");
    }
  };

  const savePaymentDetails = async (transactionDetails) => {
    try {
      const response = await fetch("http://localhost:8081/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionDetails),
      });

      if (!response.ok) {
        throw new Error("Failed to save payment details.");
      }

      console.log("Payment details saved successfully.");
    } catch (error) {
      console.error("Error saving payment details:", error);
      alert("Error saving payment details. Please try again.");
    }
  };


  return (
    <div>
      <h3>Payment</h3>
      <div id="paypal-button-container"></div>
      <button
        onClick={() => navigate(-1)}
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