import "./Header.css";
import { Link, useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();

  return (
    <header className="app-header">
      <h3>ScamProducts.com</h3>

      <nav className="nav-links">
        {/* Left side: Login/Signup if not on home */}
        <div className="left-links">
          {location.pathname !== "/home" && location.pathname !== "/" && <Link to="/">Login</Link>}
          {location.pathname !== "/home" && location.pathname !== "/signup" && <Link to="/signup">Sign Up</Link>}
        </div>

        {/* Right side: Profile / Cart if on home */}
        <div className="right-links">
          {location.pathname === "/home" && <Link to="/profile">Profile</Link>}
          {location.pathname === "/home" && <Link to="/cart">Cart</Link>}
          {location.pathname === "/home" && <Link to="/orders">Orders</Link>}

        </div>
      </nav>
    </header>
  );
}

export default Header;
