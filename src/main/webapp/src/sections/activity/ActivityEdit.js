import React, { Component } from "react";
import { activity } from "../../lib/api";
import ImageEditor from "../common/ImageEditor";
import FileUpload from "../common/FileUpload";
import RichEditor from "../common/RichEditor";
import NavigationBlocker from "../common/NavigationBlocker";

class ActivityEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.id,
      form: null,
      init: false,
      blocking: true,
      error: false,
    };

    this.onChange = this.onChange.bind(this);
    this.onFormChange = this.onFormChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  componentDidMount() {
    activity
      .get(this.state.id)
      .then((json) =>
        this.setState({
          id: json.id,
          form: {
            title: json.title,
            subtitle: json.subtitle,
            description: json.description,
            images: json.images.map((image) => ({
              fileId: image.fileId,
              title: image.title,
            })),
            documents: json.documents.map((doc) => ({
              fileId: doc.fileId,
              name: doc.title,
            })),
          },
          init: true,
        })
      )
      .catch((error) =>
        this.setState({
          data: null,
        })
      );
  }

  onChange(name, value) {
    this.setState((prevState) => ({
      form: {
        ...prevState.form,
        [name]: value,
      },
      error: false,
    }));
  }

  onFormChange(event) {
    const { name, value } = event.target;
    this.onChange(name, value);
  }

  onImagesChange(images) {
    this.setState((prevState) => ({
      form: {
        ...prevState.form,
        images,
      },
      error: false,
    }));
  }

  onDocumentsChange(documents) {
    this.setState((prevState) => ({
      form: {
        ...prevState.form,
        documents,
      },
      error: false,
    }));
  }

  onFormSubmit(event) {
    event.preventDefault();

    activity
      .edit(this.state.id, this.state.form)
      .then(() => {
        this.setState({ blocking: false }, () =>
          this.props.history.push(`/activity/${this.state.id}`)
        );
      })
      .catch((error) => {
        this.setState({
          error: true,
        });
      });
  }

  render() {
    if (!this.state.init) {
      return null;
    }
    console.log("Documents:", this.state.form.documents); // Log the documents object
    return (
      <section className="section">
        <div className="container">
          <h1 className="title">Edit Activity</h1>

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
              <label className="label">Documents</label>
              <div className="control">
                <FileUpload
                  files={this.state.form.documents}
                  accept=".pdf,.doc,.docx"
                  onChange={(documents) => this.onDocumentsChange(documents)}
                />
              </div>
            </div>
            <div className="field is-grouped">
              <div className="control">
                <button type="submit" className="button is-link">
                  Edit Activity
                </button>
              </div>
              <div className="control">
                <button
                  type="button"
                  className="button is-light"
                  onClick={() =>
                    this.props.history.push(`/activity/${this.state.id}`)
                  }
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

export default ActivityEdit;
