import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState("");

  const token = localStorage.getItem("accessToken");

  // Helper to decode JWT and get user id
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

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `http://localhost:3000/api/products/getProductId/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Product not found");
        } else {
          setProduct(data.message);

          if (data.getImage && data.getImage.length > 0) {
            const imgObj = data.getImage[0];
            const imgArray = [imgObj.productUrl1, imgObj.productUrl2, imgObj.productUrl3].filter(Boolean);
            setImages(imgArray);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, token]);

  const handleAddToCart = async () => {
    if (!product) return;

    const userId = getUserIdFromToken(token);
    if (!userId) {
      setCartMessage("User not found. Please login.");
      return;
    }

    setCartMessage("Adding to cart...");
    try {
      const res = await fetch(`http://localhost:3000/api/carts/addToCart`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          product_id: product.id,
          quantity: quantity,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setCartMessage(data.message || "Failed to add to cart");
      } else {
        setCartMessage("Added to cart successfully!");
      }
    } catch (err) {
      setCartMessage(err.message || "Failed to add to cart");
    }
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">Error: {error}</p>;
  if (!product) return <p className="error">No product found</p>;

  return (
    <div className="product-details-container">
      <div className="product-images">
        {images.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`${product.product_name} ${index + 1}`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/200?text=Image+Not+Found";
            }}
          />
        ))}
      </div>

      <h2>{product.product_name}</h2>
      <p>{product.product_details}</p>
      <p>Price: ₹{product.product_price}</p>
      <p>Stock: {product.product_stock}</p>

      <div style={{ margin: "15px 0" }}>
        <label>
          Quantity:{" "}
          <input
            type="number"
            min="1"
            max={product.product_stock}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            style={{ width: "60px", marginLeft: "5px" }}
          />
        </label>
      </div>

      <button onClick={handleAddToCart} style={{ padding: "10px 20px", cursor: "pointer" }}>
        Add to Cart
      </button>

      {cartMessage && <p style={{ marginTop: "10px", color: "green" }}>{cartMessage}</p>}
    </div>
  );
};

export default ProductDetails;
