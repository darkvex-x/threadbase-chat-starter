import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <h1>Welcome to Threadbase</h1>
      <p className="muted">Real-time communication and live thread discussions</p>
      {user ? (
        <Link to="/threads" className="btn-primary">
          Go to Live Chat
        </Link>
      ) : (
        <Link to="/login" className="btn-primary">
          Log in to Join Chat
        </Link>
      )}
    </div>
  );
}
