import React, { Component } from "react";
import { FaUpload } from "react-icons/fa";
import { file } from "../../lib/api";

class FileUpload extends Component {
  constructor(props) {
    super(props);

    this.onAddFile = this.onAddFile.bind(this);
    this.onRemoveFile = this.onRemoveFile.bind(this);
  }

  onAddFile(event) {
    const selectedFiles = Array.from(event.target.files); // Handle multiple files
    const uploadPromises = selectedFiles.map((fileToUpload) => {
      const formData = new FormData();
      formData.append("file", fileToUpload);

      return file
        .add(formData)
        .then((uploadedFile) => ({
          fileId: uploadedFile.id,
          name: uploadedFile.name || "Uploaded Document",
        }))
        .catch((error) => {
          console.error("Error uploading file:", error);
          return null; // Return null for failed uploads
        });
    });

    // Wait for all uploads to complete
    Promise.all(uploadPromises).then((uploadedFiles) => {
      const validFiles = uploadedFiles.filter((file) => file !== null); // Remove failed uploads
      const updatedFiles = [...this.props.files, ...validFiles]; // Append new files to existing ones
      this.props.onChange(updatedFiles);
    });
  }

  onRemoveFile(event, fileId) {
    const updatedFiles = this.props.files.filter(
      (file) => file.fileId !== fileId
    );
    this.props.onChange(updatedFiles);
  }

  render() {
    const height = 150;
    const { files } = this.props;
    console.log("Files:", files); // Debugging: Logs the files data
    return (
      <div style={{ display: "flex", flex: 1, flexWrap: "wrap" }}>
        <div
          style={{
            marginBottom: "20px",
            height: `${height}px`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "whitesmoke",
            padding: "10px",
          }}
        >
          <div className="file is-boxed">
            <label className="file-label">
              <input
                className="file-input"
                name="files"
                type="file"
                accept={this.props.accept || "*"}
                onChange={this.onAddFile}
                multiple
              />
              <span className="file-cta" style={{ border: "none" }}>
                <span className="file-icon">
                  <FaUpload />
                </span>
                <span className="file-label">Choose files…</span>
              </span>
            </label>
          </div>
        </div>

        {files && files.length > 0 && (
          <div style={{ marginTop: "10px" }}>
            {files.map((file) => (
              <div
                key={file.fileId}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <span>{file.name}</span>
                <button
                  style={{
                    marginLeft: "10px",
                    backgroundColor: "black",
                    color: "white",
                    cursor: "pointer",
                  }}
                  onClick={(event) => this.onRemoveFile(event, file.fileId)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default FileUpload;
