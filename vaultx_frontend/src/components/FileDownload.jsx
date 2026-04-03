// src/pages/FileDownload.jsx
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

const FileDownload = () => {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Preparing download...");
  const password = searchParams.get("password") || "";

  useEffect(() => {
    const downloadFile = async () => {
      try {
        const res = await fetch(`http://localhost:5000/share/${token}?password=${password}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // if JWT is needed
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          setStatus(`Error: ${errorData.error}`);
          return;
        }

        const blob = await res.blob();
        const contentDisposition = res.headers.get("Content-Disposition");
        let filename = "downloaded_file";
        if (contentDisposition) {
          const match = contentDisposition.match(/filename=(.*)/);
          if (match) filename = match[1];
        }

        // Trigger download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        setStatus("File downloaded successfully!");
      } catch (err) {
        console.error(err);
        setStatus("Download failed");
      }
    };

    downloadFile();
  }, [token, password]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>File Download</h2>
      <p>{status}</p>
    </div>
  );
};

export default FileDownload;
