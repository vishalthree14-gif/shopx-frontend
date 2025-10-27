import React, { useEffect, useState } from "react";
import "./CartPage.css";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod"); // default: Cash on Delivery

  const token = localStorage.getItem("accessToken");

  // Decode JWT to get user id
  const getUserIdFromToken = (token) => {
    if (!token) return null;
    try {
      const payload = token.split(".")[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.id;
    } catch (err) {
      console.error("Failed to decode token:", err);
      return null;
    }
  };

  const userId = getUserIdFromToken(token);

  useEffect(() => {
    if (!userId) {
      setError("User not found. Please login.");
      return;
    }

    const fetchCart = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/carts/viewCart`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to fetch cart");
        } else {
          setCartItems(data.data || []);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [token, userId]);

  const handleRemove = async (product_id) => {

  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/carts/cartRemoveItem/${product_id}`, {
      method: "GET", // ✅ backend uses GET, not DELETE
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (res.ok) {
      setCartItems(cartItems.filter((item) => item.product_id !== product_id)); 
    } else {
      alert(data.message || "Failed to remove item");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong while removing item");
  }
};

// const handlePlaceOrder = async () => {


//   try {
//     const res = await fetch("http://localhost:3000/api/orders/addOrder", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ payment_method: paymentMethod }),
//     });

//     const data = await res.json();

//     if (res.ok) {
//       alert(data.message || "Order placed successfully!");
//       setCartItems([]); // Clear cart in frontend
//     } else {
//       alert(data.message || "Failed to place order");
//     }
//   } catch (err) {
//     console.error(err);
//     alert("Error placing order");
//   }
// };


useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  document.body.appendChild(script);
}, []);



const handlePlaceOrder = async () => {
  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.Product?.product_price * item.quantity,
    0
  );

  if (paymentMethod === "cod") {
    // Existing COD logic
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/addOrder`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payment_method: "cod" }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Order placed successfully!");
        setCartItems([]);
      } else {
        alert(data.message || "Failed to place order");
      }
    } catch (err) {
      console.error(err);
      alert("Error placing order");
    }
    return;
  }

  // Razorpay Payment Flow
  try {
    // 1️⃣ Create order from backend
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payments/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: totalAmount }),
    });

    const data = await res.json();

    // 2️⃣ Open Razorpay popup
    const options = {
      key: "rzp_test_RXwxaW2Vhw8KQr", // from Razorpay Dashboard
      amount: data.amount,
      currency: data.currency,
      name: "My Shop",
      description: "Order Payment",
      order_id: data.orderId,
      handler: async function (response) {
        // 3️⃣ Verify payment on backend
        const verifyRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payments/verify-payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response),
        });

        const verifyData = await verifyRes.json();

        if (verifyData.success) {
          alert("Payment successful! ✅");

          // Create order entry in DB
          await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/addOrder`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ payment_method: "razorpay" }),
          });

          setCartItems([]);
        } else {
          alert("Payment verification failed ❌");
        }
      },
      theme: { color: "#3399cc" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error(err);
    alert("Error initiating payment");
  }
};



  if (loading) return <p className="loading">Loading cart...</p>;
  if (error) return <p className="error">Error: {error}</p>;
  if (cartItems.length === 0) return <p className="empty">Your cart is empty.</p>;

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      <table className="cart-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.id}>
              <td>{item.Product?.product_name || "Unnamed Product"}</td>
              <td>₹{item.Product?.product_price || 0}</td>
              <td>{item.quantity}</td>
              <td>
                ₹{(item.Product?.product_price * item.quantity).toFixed(2)}
              </td>
              <td>
                <button
                  className="remove-btn"
                  onClick={() => handleRemove(item.product_id)} // ✅ fixed here
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>
        Total: ₹
        {cartItems
          .reduce(
            (acc, item) => acc + item.Product?.product_price * item.quantity,
            0
          )
          .toFixed(2)}
      </h3>

      <div className="payment-options">
        <h4>Select Payment Method:</h4>
        <label>
          <input
            type="radio"
            name="payment"
            value="paynow"
            checked={paymentMethod === "paynow"}
            onChange={() => setPaymentMethod("paynow")}
          />
          Pay Now
        </label>
        <label>
          <input
            type="radio"
            name="payment"
            value="cod"
            checked={paymentMethod === "cod"}
            onChange={() => setPaymentMethod("cod")}
          />
          Cash on Delivery
        </label>
      </div>

      <button className="place-order-btn" onClick={handlePlaceOrder}>
        Place Order
      </button>
    </div>
  );
};

export default CartPage;
