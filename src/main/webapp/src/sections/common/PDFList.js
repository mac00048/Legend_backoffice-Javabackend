import React, { Component } from "react";
import { empty } from "../../lib/helpers";

class PDFList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props.documents || this.props.documents.length === 0) {
      return empty();
    }

    return (
      <div style={{ display: "flex", flex: 1, flexWrap: "wrap" }}>
        {this.props.documents.map((doc) => (
          <div
            key={doc.fileId}
            style={{
              marginRight: "20px",
              marginBottom: "20px",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              maxWidth: "300px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <a
              href={`/api/file/${doc.fileId}/download`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
                color: "#333",
                fontWeight: "bold",
                wordWrap: "break-word",
              }}
            >
              {doc.title || "Unnamed PDF"}
            </a>
          </div>
        ))}
      </div>
    );
  }
}

export default PDFList;
