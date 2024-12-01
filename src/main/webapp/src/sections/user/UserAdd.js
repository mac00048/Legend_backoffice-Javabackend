import React, { Component, useState } from "react";
import { user } from "../../lib/api";
import { activity } from "../../lib/api";
import ImageEditor from "../common/ImageEditor";
import RichEditor from "../common/RichEditor";
import NavigationBlocker from "../common/NavigationBlocker";

class UserAdd extends Component {
  constructor(props) {
    super(props);

    this.state = {
      form: {
        name: "",
        email: "",
        password: "",
        phone: "",
        role: "User",
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
    console.log(this.state.form.role);
    user
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
              <label className="label">Name</label>
              <div className="control">
                <input
                  name="name"
                  className="input"
                  type="text"
                  required
                  value={this.state.form.name}
                  onChange={this.onFormChange}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Email</label>
              <div className="control">
                <input
                  name="email"
                  className="input"
                  type="text"
                  value={this.state.form.email}
                  onChange={this.onFormChange}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Password</label>
              <div className="control">
                <input
                  name="password"
                  className="input"
                  type="text"
                  value={this.state.form.password}
                  onChange={this.onFormChange}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">phone</label>
              <div className="control">
                <input
                  name="phone"
                  className="input"
                  type="text"
                  value={this.state.form.phone}
                  onChange={this.onFormChange}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Role</label>
              <div className="control">
                <div className="select is-fullwidth">
                  <select
                    name="role"
                    value={this.state.form.role || "User"}
                    onChange={this.onFormChange}
                  >
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                  </select>
                </div>
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
                  onClick={() => this.props.history.push("/user")}
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
