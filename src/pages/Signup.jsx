
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabase";

export default function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signup = async () => {
    if (!email || !password) {
      alert("Email and password required");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      alert("Signup successful 🎉");
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h2>Create Account</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={inputStyle}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={inputStyle}
      />

      <button onClick={signup} disabled={loading} style={buttonStyle}>
        {loading ? "Signing up..." : "Sign Up"}
      </button>

      <p style={{ marginTop: 15 }}>
        Already have an account?{" "}
        <Link to="/login" style={{ color: "#2563eb" }}>
          Login
        </Link>
      </p>
    </div>
  );
}

/* ---------- STYLES ---------- */

const containerStyle = {
  maxWidth: "400px",
  margin: "100px auto",
  padding: "30px",
  background: "#fff",
  borderRadius: "12px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  textAlign: "center",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};
