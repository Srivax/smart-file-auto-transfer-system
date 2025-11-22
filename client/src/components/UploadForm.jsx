export default function UploadForm({
  selectedFile,
  onFileSelect,
  onUpload,
  onClear,
  isUploading
}) {
  const handleFileChange = (event) => {
    const file = event.target.files && event.target.files[0] ? event.target.files[0] : null;
    onFileSelect(file);
  };

  return (
    <div className="upload-row">
      <div>
        <label className="file-label-text" htmlFor="file-input">
          Choose Excel file
        </label>
        <input
          id="file-input"
          className="file-input-hidden"
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
        />
        <button
          type="button" 
          style={{marginLeft : "10px"}}
          className="btn-file"
          onClick={() => document.getElementById("file-input").click()}
        >
          Browse
        </button>
        <p className="file-selected-info">
          Selected file:{" "}
          <span className="file-selected-name">
            {selectedFile ? selectedFile.name : "No file selected"}
          </span>
        </p>
      </div>
      <div style={{ textAlign: "right" }}>
        <button
          type="button"
          className="btn-upload"
          onClick={onUpload}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
        <button
          type="button"
          className="btn-clear"
          onClick={onClear}
          disabled={isUploading && !selectedFile}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
