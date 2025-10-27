import React from "react";
import "./ProductList.css";
import { useNavigate } from 'react-router-dom'

const ProductCart = ({ product_name, product_price, id }) => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${id}`);
  }

  return (
    <div className="product-card">
      <div className="product-image">Image</div>
      <p className="product-name">{product_name}</p>
      <p className="product-price">₹{product_price}</p>
      <button className="view-btn" onClick={handleClick}>View Product</button>
    </div>
  );
};

export default ProductCart;

