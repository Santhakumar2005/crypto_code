import { useEffect, useState } from "react";
import axios from "axios";
import FileUpload from "./FileUpload";
import "../styles/DashBoard.css";
function Dashboard() {
  const [files, setFiles] = useState([]);
  const [userId, setUserId] = useState(""); // logged-in user ID
  const [links, setLinks] = useState({});   // store generated links per file

  // Fetch files for logged-in user
  const fetchFiles = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      // Decode JWT to get user ID
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.id);

      const res = await axios.get("http://localhost:5000/api/files/my-files", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFiles(res.data);
    } catch (err) {
      console.error("Error fetching files:", err.response?.data || err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // Generate shareable link for a file
  const generateLink = async (fileId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const expiresInMinutes = 60; // default: 1 hour
    const maxViews = 5;           // default max views
    const password = prompt("Enter password for this link (optional)");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/links/generate-link",
        { fileId, expiresInMinutes, maxViews, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Save generated link in state to display
      setLinks(prev => ({ ...prev, [fileId]: res.data.link }));
    } catch (err) {
      console.error("Error generating link:", err.response?.data || err);
      alert("Failed to generate link");
    }
  };

  return (
  <div className="dashboard">
    <h2>My Files</h2>

    {/* Upload */}
    <div className="upload-box">
      <FileUpload fetchFiles={fetchFiles} />
    </div>

    {files.length === 0 ? (
      <p className="empty">No files available.</p>
    ) : (
      <ul className="file-list">
        {files.map(f => (
          <li key={f.id} className="file-card">
            <div className="file-info">
              <strong>{f.filename}</strong>
              <p>Sender: {f.senderEmail}</p>
              <p>Receiver: {f.receiverEmail}</p>
            </div>

            {f.senderId === userId && (
              <div className="file-actions">
                <button onClick={() => generateLink(f.id)}>
                  Generate Link
                </button>

                {links[f.id] && (
                  <div className="link-box">
                    <input type="text" readOnly value={links[f.id]} />
                    <button onClick={() => navigator.clipboard.writeText(links[f.id])}>
                      Copy
                    </button>
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    )}
  </div>
);

}

export default Dashboard;
