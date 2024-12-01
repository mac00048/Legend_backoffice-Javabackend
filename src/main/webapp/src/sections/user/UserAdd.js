import React, { Component, useState } from "react";
import { activity } from "../../lib/api";
import ImageEditor from "../common/ImageEditor";
import RichEditor from "../common/RichEditor";
import NavigationBlocker from "../common/NavigationBlocker";

class UserAdd extends Component {
  constructor(props) {
    super(props);

    this.state = {
      form: {
        title: "",
        subtitle: "",
        description: "",
        images: [],
      },
      blocking: true,
      error: false,
    };

    this.onChange = this.onChange.bind(this);
    this.onFormChange = this.onFormChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
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
      .then((json) => {
        this.setState({ blocking: false }, () =>
          this.props.history.push(`/user`)
        );
      })
      .catch((error) => {
        this.setState({
          error: true,
        });
      });
  }

  render() {
    return (
      <section className="section">
        <div className="container">
          <h1 className="title">Add User</h1>

          <form name="contact" method="POST" onSubmit={this.onFormSubmit}>
            <div className="field">
              <label className="label">Email</label>
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
              <label className="label">Password</label>
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
                  Add User
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

export default UserAdd;
