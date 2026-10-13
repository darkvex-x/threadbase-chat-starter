import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        Threadbase
      </Link>

      <div className="nav-links">
        <Link to="/threads">Threads</Link>

        {user ? (
          <div className="user-section">
            <span className="greeting">Hi, {user.name}</span>
            <button onClick={logout} className="btn-logout">
              Log out
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn-login-link">
            Log in
          </Link>
        )}
      </div>
    </nav>
  );
}
