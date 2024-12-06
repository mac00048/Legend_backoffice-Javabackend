import React, { Component } from "react";
import { activity } from "../../lib/api";
import ImageEditor from "../common/ImageEditor";
import FileUpload from "../common/FileUpload";
import RichEditor from "../common/RichEditor";
import NavigationBlocker from "../common/NavigationBlocker";

class ActivityAdd extends Component {
  constructor(props) {
    super(props);

    this.state = {
      form: {
        title: "",
        subtitle: "",
        description: "",
        images: [],
        documents: [],
      },
      blocking: true,
      error: false,
    };

    this.onChange = this.onChange.bind(this);
    this.onFormChange = this.onFormChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onDocumentUpload = this.onDocumentUpload.bind(this);
  }

  onChange(name, value) {
    this.setState((prevState) => {
      return {
        form: {
          ...prevState.form,
          [name]: value,
        },
        error: false,
      };
    });
  }

  onFormChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.onChange(name, value);
  }

  onFormSubmit(event) {
    event.preventDefault();

    activity
      .add(this.state.form)
      .then(() => {
        console.log(this.state.form.documents);
        console.log(this.state.form.images);

        this.setState({ blocking: false }, () =>
          this.props.history.push(`/activity`)
        );
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
        this.setState({
          error: true,
        });
      });
  }

  onDocumentUpload(file) {
    this.setState((prevState) => ({
      form: {
        ...prevState.form,
        documents: [...prevState.form.documents, file], // Append uploaded file to documents array
      },
    }));
  }

  render() {
    return (
      <section className="section">
        <div className="container">
          <h1 className="title">Add Activity</h1>

          <form name="contact" method="POST" onSubmit={this.onFormSubmit}>
            <div className="field">
              <label className="label">Title</label>
              <div className="control">
                <input
                  name="title"
                  className="input"
                  type="text"
                  required
                  value={this.state.form.title}
                  onChange={this.onFormChange}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Subtitle</label>
              <div className="control">
                <input
                  name="subtitle"
                  className="input"
                  type="text"
                  value={this.state.form.subtitle}
                  onChange={this.onFormChange}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Description</label>
              <div className="control">
                <RichEditor
                  value={this.state.form.description}
                  onChange={(value) => this.onChange("description", value)}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Images</label>
              <div className="control">
                <ImageEditor
                  images={this.state.form.images}
                  onChange={(images) => this.onChange("images", images)}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Upload Documents (PDF/DOC)</label>
              <div className="control">
                <FileUpload
                  accept=".pdf,.doc,.docx"
                  onChange={this.onDocumentUpload}
                />
              </div>
              {this.state.form.documents.length > 0 && (
                <div className="uploaded-files">
                  <p>Uploaded Documents:</p>
                  <ul>
                    {this.state.form.documents.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="field is-grouped">
              <div className="control">
                <button type="submit" className="button is-link">
                  Add Activity
                </button>
              </div>
              <div className="control">
                <button
                  type="button"
                  className="button is-light"
                  onClick={() => this.props.history.push("/activity")}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
          <NavigationBlocker
            enabled={this.state.blocking}
            data={this.state.form}
          />
        </div>
      </section>
    );
  }
}

export default ActivityAdd;
