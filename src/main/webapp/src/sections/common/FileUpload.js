import React, { Component } from "react";
import { FaUpload } from "react-icons/fa";
import { file } from "../../lib/api";

class FileUpload extends Component {
  constructor(props) {
    super(props);

    this.onAddFile = this.onAddFile.bind(this);
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

  render() {
    const { files } = this.props;

    const containerStyle = {
      display: "flex",
      flexWrap: "wrap",
      width: "100%", // Ensure consistency with ImageEditor
    };

    const fileItemStyle = {
      marginRight: "20px",
      marginBottom: "20px",
      padding: "10px",
      border: "1px solid lightgray",
      borderRadius: "5px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "calc(20% - 20px)", // Matches ImageEditor width layout
      boxSizing: "border-box",
    };

    const uploadBoxStyle = {
      marginBottom: "20px",
      height: "150px", // Matches ImageEditor height
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "whitesmoke",
      borderRadius: "5px",
      border: "1px dashed gray",
      padding: "10px",
      cursor: "pointer",
      width: "calc(20% - 20px)", // Matches ImageEditor layout
      boxSizing: "border-box",
    };

    return (
      <div style={containerStyle}>
        {files &&
          files.map((file, index) => (
            <div key={file.fileId || index} style={fileItemStyle}>
              <span>{file.name}</span>
            </div>
          ))}

        <div style={uploadBoxStyle}>
          <div className="file is-boxed">
            <label className="file-label">
              <input
                className="file-input"
                name="files"
                type="file"
                accept={this.props.accept || "*"}
                onChange={this.onAddFile}
                multiple // Allow multiple file selection
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
      </div>
    );
  }
}

export default FileUpload;
