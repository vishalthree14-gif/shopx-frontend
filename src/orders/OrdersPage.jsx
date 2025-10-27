import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OrdersPage.css";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch orders using your curl API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/getOrders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data.data || []);
      setMessage(res.data.message || "");
    } catch (err) {
      console.error(err);
      setMessage("Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="orders-container">
      <h2>Your Orders</h2>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length > 0 ? (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Order Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>₹{order.total_amount}</td>
                <td>{order.status}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="empty-message">{message || "No orders found."}</p>
      )}
    </div>
  );
};

export default OrdersPage;
