import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // get current user
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    // listen to auth changes (login / logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // ⏳ prevent flicker
  if (loading) return null;

  return (
    <nav
      style={{
        display: "flex",
        gap: "15px",
        padding: "12px",
        background: "#111",
        color: "#fff",
        alignItems: "center",
      }}
    >
      {/* Home only for logged-in users */}
      {user && (
        <Link to="/home" style={{ color: "#fff" }}>
          Home
        </Link>
      )}

      <Link to="/exhibition" style={{ color: "#fff" }}>
        Exhibition
      </Link>

      <Link to="/gallery" style={{ color: "#fff" }}>
        Gallery
      </Link>

      {user && (
        <Link to="/my-posts" style={{ color: "#fff" }}>
          My Page
        </Link>
      )}

      {!user ? (
        <>
          <Link to="/login" style={{ color: "#fff" }}>
            Login
          </Link>

          {/* Signup route */}
          <Link to="/" style={{ color: "#fff" }}>
            Signup
          </Link>
        </>
      ) : (
        <button
          onClick={handleLogout}
          style={{
            background: "red",
            color: "#fff",
            border: "none",
            padding: "6px 10px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      )}
    </nav>
  );
}

export default Navbar;
