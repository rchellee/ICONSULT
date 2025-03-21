import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../sidebar";
import Topbar from "../Topbar";

const Payment = ({ projectId, amount, onClose }) => {
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    if (!document.getElementById("paypal-sdk")) {
      const script = document.createElement("script");
      script.src =
        "https://www.paypal.com/sdk/js?client-id=AasBE41jco_SD_cOslD07xD_sBSoZRinvpsKsvgqJqk9XU_nGu4hO-tspC1dLWFMy5Hj6d7bJLl_dvMS&currency=PHP";
      script.id = "paypal-sdk";
      script.async = true;
      script.onload = () => initializePayPalButtons();
      document.body.appendChild(script);
    } else {
      initializePayPalButtons();
    }

    return () => {
      const paypalButtons = document.getElementById("paypal-button-container");
      if (paypalButtons) {
        paypalButtons.innerHTML = "";
      }
    };
  }, []);

  const updatePaymentStatus = async (projectId) => {
    try {
      const response = await fetch(
        `http://localhost:8081/project/update-payment-status/${projectId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ paymentStatus: "Partial Payment" }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update payment status.");
      }

      console.log("Payment status updated to 'Partial Payment'.");
    } catch (error) {
      console.error("Error updating payment status:", error);
      alert("Error updating payment status. Please try again.");
    }
  };

  const initializePayPalButtons = () => {
    if (window.paypal) {
      window.paypal
        .Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    currency_code: "PHP",
                    value: amount,
                  },
                },
              ],
            });
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then((details) => {
              console.log("PayPal Transaction Details:", details);
              const clientId = localStorage.getItem("clientId");
              const payeeDetails = details.purchase_units[0].payee;
              const payeeEmail =
                payeeDetails?.email_address || "Unknown Payee Email";
              const payeeMerchantId =
                payeeDetails?.merchant_id || "Unknown Merchant ID";
              const payeeName =
                payeeDetails?.business_name ||
                payeeDetails?.email_address ||
                "Unknown Merchant Name";

              const transactionDetails = {
                transactionId: details.id,
                payerName:
                  details.payer.name.given_name +
                  " " +
                  details.payer.name.surname,
                payerEmail: details.payer.email_address,
                amount: details.purchase_units[0].amount.value,
                currency: details.purchase_units[0].amount.currency_code,
                payedToEmail: payeeEmail,
                payeeMerchantId: payeeMerchantId,
                payeeName: payeeName,
                clientId,
                projectId,
              };
              savePaymentDetails(transactionDetails);
              updatePaymentStatus(projectId);

              console.log("Transaction Details:", details);
              alert(`Transaction completed by ${transactionDetails.payerName}`);
              onClose();
            });
          },
          onError: (err) => {
            console.error("PayPal Checkout Error:", err);
          },
        })
        .render("#paypal-button-container");
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
      <button onClick={onClose} className="closepayment-button">
        Close
      </button>
    </div>
  );
};

export default Payment;
