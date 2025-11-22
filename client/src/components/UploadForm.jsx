import { useRef } from "react";

function UploadForm({ selectedFile, onFileChange, onUpload, isUploading }) {
const fileInputRef = useRef(null);

const handleBrowseClick = () => {
if (fileInputRef.current) {
fileInputRef.current.click();
}
};

const handleFileChangeInternal = (event) => {
const file = event.target.files && event.target.files[0];
if (!file) return;
if (onFileChange) {
onFileChange(file);
}
};

const handleUploadClick = () => {
if (onUpload) {
onUpload();
}
};

return (
<section className="upload-section">
<div className="upload-card">
<div className="upload-row">
<button type="button" className="btn-file" onClick={handleBrowseClick} >
Choose file
</button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx"
        className="file-input-hidden"
        onChange={handleFileChangeInternal}
      />

      <span className="file-label-text">
        {selectedFile ? selectedFile.name : "No file selected yet"}
      </span>

      <button
        type="button"
        className="btn-upload"
        onClick={handleUploadClick}
        disabled={!selectedFile || isUploading}
      >
        {isUploading ? "Uploading..." : "Upload"}
      </button>
    </div>

    <p className="file-selected-info">
      Selected file:{" "}
      <span className="file-selected-name">
        {selectedFile ? selectedFile.name : "None"}
      </span>
    </p>
  </div>
</section>


);
}

export default UploadForm;