import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        username,
        email,
        password
      });

      alert("Signup successful ✅");
      navigate("/login");

    } catch (err) {
      alert(err.response?.data?.error || "Signup failed");
    }
  };

  return (
  <div className="container">
    <div className="card">
      <h2>Signup</h2>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button onClick={handleSignup}>Signup</button>

      {/* optional (recommended) */}
      <p className="link" onClick={() => navigate("/login")}>
        Already have an account? Login
      </p>
    </div>
  </div>
);

}

export default Signup;