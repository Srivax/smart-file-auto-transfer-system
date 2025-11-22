import { useState, useEffect } from "react";
import UploadForm from "./components/UploadForm";
import ResponseCard from "./components/ResponseCard";
import AlertBox from "./components/AlertBox";
import { buildAISummary } from "./utils/aiSummary";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [alert, setAlert] = useState(null);
  const [aiSummary, setAiSummary] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("sfats-theme");
    if (stored === "dark") {
      setDarkMode(true);
      document.body.classList.add("body-dark");
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("body-dark");
      localStorage.setItem("sfats-theme", "dark");
    } else {
      document.body.classList.remove("body-dark");
      localStorage.setItem("sfats-theme", "light");
    }
  }, [darkMode]);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setResult(null);
    setAiSummary("");
    setAlert(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setAlert({
        type: "warning",
        title: "No file selected",
        message: "Please choose an Excel file before clicking Upload."
      });
      return;
    }

    try {
      setIsUploading(true);
      setAlert(null);

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        setAlert({
          type: "error",
          title: "Upload failed",
          message: data.message || "The server reported an error while processing your file."
        });
        setResult(null);
        setAiSummary("");
        return;
      }

      const safeResult = {
        message: data.message || "Upload completed",
        fileName: selectedFile.name,
        totalRows: typeof data.totalRows === "number" ? data.totalRows : 0,
        inserted: typeof data.inserted === "number" ? data.inserted : 0,
        failed: typeof data.failed === "number" ? data.failed : 0
      };

      setResult(safeResult);

      try {
        const summaryText = await buildAISummary(safeResult);
        setAiSummary(summaryText);
      } catch (err) {
        console.error("AI summary error", err);
      }

      setAlert({
        type: "success",
        title: "Upload successful",
        message: "The file was processed successfully. Review the upload summary below."
      });
    } catch (err) {
      console.error("Upload error", err);
      setAlert({
        type: "error",
        title: "Network or server error",
        message: "Could not reach the upload API. Please check if the backend server is running."
      });
      setResult(null);
      setAiSummary("");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setResult(null);
    setAiSummary("");
    setAlert(null);
  };

  return (
    <div className={darkMode ? "app app-dark" : "app"}>
      <header className="hero-card">
        <div className="hero-left">
          <h1 className="hero-title">Smart File AutoTransfer System</h1>
          <p className="hero-subtitle">
            Upload Excel mark sheets, validate data, and review clean upload summaries for teachers,
            principals, students, and parents.
          </p>
        </div>
        <button
          type="button"
          className="theme-toggle"
          onClick={() => setDarkMode((prev) => !prev)}
        >
          <span className="theme-icon">{darkMode ? "🌙" : "☀️"}</span>
          <span className="theme-text">{darkMode ? "Dark" : "Light"} mode</span>
        </button>
      </header>

      <main className="main-shell">
        {alert && (
          <AlertBox
            type={alert.type}
            title={alert.title}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        <section className="upload-section">
          <div className="upload-card">
            <p className="upload-heading">Upload Excel and view API response</p>
            <UploadForm
              selectedFile={selectedFile}
              onFileSelect={handleFileSelect}
              onUpload={handleUpload}
              onClear={handleClear}
              isUploading={isUploading}
            />
          </div>
        </section>

        {result && (
          <section className="summary-section">
            <div className="summary-card">
              <ResponseCard
                message={result.message}
                fileName={result.fileName}
                totalRows={result.totalRows}
                inserted={result.inserted}
                failed={result.failed}
              />
              {aiSummary && (
                <div className="ai-summary-box">
                  <h3 className="ai-summary-title">Summary</h3>
                  <p className="ai-summary-text">{aiSummary}</p>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
