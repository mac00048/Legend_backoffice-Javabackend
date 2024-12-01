import React, { Component } from "react";
import { activity } from "../../lib/api";
import ImageEditor from "../common/ImageEditor";
import RichEditor from "../common/RichEditor";
import NavigationBlocker from "../common/NavigationBlocker";

class UserEdit extends Component {
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
            images: json.images.map((image) => {
              return { fileId: image.fileId, title: image.title };
            }),
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

  onImagesChange(images) {
    this.setState((prevState) => {
      return {
        form: {
          ...prevState.form,
          images: images,
        },
        error: false,
      };
    });
  }

  onFormSubmit(event) {
    event.preventDefault();

    activity
      .edit(this.state.id, this.state.form)
      .then((json) => {
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
            <div className="field is-grouped">
              <div className="control">
                <button type="submit" className="button is-link">
                  Save User
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

export default UserEdit;
