import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Upload from "./components/FileUpload";
import FileDownload from "./components/FileDownload";
import Dashboard from "./components/Dashboard";
import SharedFileWrapper from "./components/SharedFileAccess";
import Signup from "./components/Signup";


function App() {
  return (
    <Router>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Login page */}
        <Route path="/login" element={<Login />} />

        {/* Upload page (after login) */}
        <Route path="/upload" element={<Upload />} />

        {/* Download page */}
        <Route path="/download/:token" element={<FileDownload />} />

        {/* Dashboard page */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Signup page */}
        <Route path="/signup" element={<Signup />} />
        {/* Other routes */}
        <Route path="/share/:token" element={<SharedFileWrapper />} />
      </Routes>
    </Router>
  );
}

export default App;
