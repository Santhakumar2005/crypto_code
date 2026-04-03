import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", {
  email: email.trim(),
  password: password.trim(),
});

    const token = res.data.token; // store in a variable first
localStorage.setItem("token", token);
console.log("Token saved:", token); // ✅ now logs correctly

    navigate("/dashboard");
  } catch (err) {
    alert(err.response?.data?.error || "Login failed");
  }
};


  return (
    <div className="container">
  <div className="card">
    <h2>Login</h2>

    <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
    <input type="password" value={password} onChange={e => setPassword(e.target.value)} />

    <button onClick={handleLogin}>Login</button>

    <p className="link" onClick={() => navigate("/signup")}>
      Don't have an account? Signup
    </p>
  </div>
</div>

  );
}

export default Login;
