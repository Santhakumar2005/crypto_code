import { useState } from "react";
import axios from "axios";

function FileUpload({ fetchLinks }) {
  const [file, setFile] = useState(null);
  const [receiverEmail, setReceiverEmail] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !receiverEmail) return alert("Select file & enter receiver email");

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);           // must match backend req.file
    formData.append("receiverEmail", receiverEmail);  // extra field

    try {
      const res = await axios.post(
        "http://localhost:5000/api/files/upload",  // <- match your backend route
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(res.data);
      fetchLinks(); // refresh dashboard
      alert("File uploaded successfully!");
    } catch (err) {
      console.error(err.response?.data || err);
      alert("File uploaded successfully!");
    }
  };

  return (
  <form onSubmit={handleUpload} className="upload-form">
    
    <input
      type="email"
      placeholder="Receiver Email"
      value={receiverEmail}
      onChange={e => setReceiverEmail(e.target.value)}
      required
    />

    <input 
      type="file" 
      onChange={e => setFile(e.target.files[0])} 
      required 
      key={file ? file.name : ""}
    />

    <button type="submit">Upload</button>

  </form>
);

}

export default FileUpload;
