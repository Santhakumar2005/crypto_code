import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/SharedFileAccess.css";

function SharedFileAccess() {
  const { token } = useParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // file password
  const [accountPassword, setAccountPassword] = useState(""); // NEW 🔥

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleDownload = async () => {
    setError("");
    try {
      const res = await axios.post(
        `http://localhost:5000/api/links/share/${token}`,
        {
          email,
          password,          // file password
          accountPassword    // NEW 🔥
        },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;

      const contentDisposition = res.headers["content-disposition"];
      if (contentDisposition) {
        const match = contentDisposition.match(/filename=(.+)/);
        if (match) a.download = match[1];
      }

      a.click();
      setSuccess(true);
    } catch (err) {
      console.log(err.response);
      setError(err.response?.data?.error || "Failed to download file");
    }
  };

  return (
  <div className="access-container">
    <div className="access-card">
      <h2>Access Shared File</h2>

      <input
        type="email"
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="File Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Account Password"
        value={accountPassword}
        onChange={(e) => setAccountPassword(e.target.value)}
      />

      <button onClick={handleDownload}>Download</button>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">Downloaded</p>}
    </div>
  </div>
);

}

export default SharedFileAccess;
