import { useState, useEffect } from "react";
import UploadForm from "./components/UploadForm";
import ResponseCard from "./components/ResponseCard";
import "./App.css";

function App() {
const [selectedFile, setSelectedFile] = useState(null);
const [result, setResult] = useState(null);
const [isUploading, setIsUploading] = useState(false);
const [darkMode, setDarkMode] = useState(false);

useEffect(() => {
const stored = localStorage.getItem("sfats-theme");
if (stored === "dark") {
setDarkMode(true);
document.body.classList.add("body-dark");
}
}, []);

const toggleTheme = () => {
setDarkMode((prev) => {
const next = !prev;
if (next) {
document.body.classList.add("body-dark");
localStorage.setItem("sfats-theme", "dark");
} else {
document.body.classList.remove("body-dark");
localStorage.setItem("sfats-theme", "light");
}
return next;
});
};

const handleFileChange = (file) => {
setSelectedFile(file);
setResult(null);
};

const handleUpload = async () => {
if (!selectedFile || isUploading) return;

try {
  setIsUploading(true);
  setResult(null);

  const formData = new FormData();
  formData.append("file", selectedFile);

  const response = await fetch("http://localhost:5000/api/upload", {
    method: "POST",
    body: formData
  });

  const data = await response.json();

  const status = response.ok ? "success" : "error";

  setResult({
    status,
    message: data.message || (status === "success" ? "Upload completed" : "Upload failed"),
    totalRows: data.totalRows ?? 0,
    inserted: data.inserted ?? 0,
    failed: data.failed ?? 0,
    fileName: selectedFile.name
  });
} catch (err) {
  setResult({
    status: "error",
    message: err.message || "Unexpected error during upload",
    totalRows: 0,
    inserted: 0,
    failed: 0,
    fileName: selectedFile ? selectedFile.name : ""
  });
} finally {
  setIsUploading(false);
}


};

return (
<div className={darkMode ? "app app-dark" : "app"}>
<header className="hero-card">
<div className="hero-left">
<h1 className="hero-title">Smart File AutoTransfer System</h1>
<p className="hero-subtitle">
Upload Excel mark sheets, validate data, and view clean upload summaries.
</p>
</div>
<button type="button" className="theme-toggle" onClick={toggleTheme} aria-label="Toggle dark mode" >
<span className="theme-icon">{darkMode ? "🌙" : "☀️"}</span>
<span className="theme-text">{darkMode ? "Dark mode" : "Light mode"}</span>
</button>
</header>

  <main className="main-shell">
    <UploadForm
      selectedFile={selectedFile}
      onFileChange={handleFileChange}
      onUpload={handleUpload}
      isUploading={isUploading}
    />

    {result && (
      <ResponseCard
        status={result.status}
        message={result.message}
        fileName={result.fileName}
        totalRows={result.totalRows}
        inserted={result.inserted}
        failed={result.failed}
      />
    )}
  </main>
</div>


);
}

export default App;