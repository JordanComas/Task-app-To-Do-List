import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const navigate = useNavigate();

  if (auth.user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault(); // prevent page reload
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:4000"
        }/api/auth/login`,
        { email, password }
      );

      auth.login(response.data.token, response.data.user);
      navigate("/dashboard");
    } catch (err: any) {
      if (err.response && err.response.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please try again.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ maxWidth: "400px", margin: "2rem auto", textAlign: "center" }}
    >
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
        />
        <button
          type="submit"
          style={{ width: "100%", padding: "0.5rem", cursor: "pointer" }}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
    </div>
  );
};

export default Login;
