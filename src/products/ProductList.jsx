import { useEffect, useState } from "react";
import ProductCart from "./ProductCart";
import "./ProductList.css";

const ProductsList = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const token = localStorage.getItem("accessToken");
  const limit = 20;

  const plusPage = () => {
    if (page < totalPage) setPage(page + 1);
  };

  const negPage = () => {
    if (page > 1) setPage(page - 1);
  };

  useEffect(() => {
    handleFetch();
  }, [page]);

  const handleFetch = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `http://localhost:3000/api/products/getProducts?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to fetch products");
        setProducts([]);
      } else {
        setProducts(data.data);
        setTotalPage(data.pagination.totalPages);
      }
    } catch (err) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="products-container">
      {loading && <p className="loading">Loading....</p>}
      {error && <p className="error">Error: {error}</p>}

      <div className="products-grid">
        {products.map((product) => (
          <ProductCart
            key={product.id}
            id={product.id}
            product_name={product.product_name}
            product_price={product.product_price}
          />
        ))}
      </div>

      <div className="pagination">
        <button onClick={negPage}>Prev</button>
        <span>
          {page} of {totalPage}
        </span>
        <button onClick={plusPage}>Next</button>
      </div>
    </div>
  );
};

export default ProductsList;

