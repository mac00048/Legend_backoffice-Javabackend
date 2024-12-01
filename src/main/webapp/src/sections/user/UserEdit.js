import React, { Component } from "react";
import { user } from "../../lib/api";
import NavigationBlocker from "../common/NavigationBlocker";

class UserEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.id,
      form: {
        name: "",
        email: "",
        password: "",
        phone: "",
        role: "User",
      },
      init: false,
      blocking: true,
      error: null,
    };

    this.onChange = this.onChange.bind(this);
    this.onFormChange = this.onFormChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  componentDidMount() {
    user
      .get(this.state.id)
      .then((json) => {
        this.setState({
          id: json.id,
          form: {
            name: json.name,
            email: json.email,
            password: "",
            phone: json.phone,
            role: json.role,
          },
          init: true,
        });
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        this.setState({
          error: "Failed to load user data.",
        });
      });
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
    const name = event.target.name;
    const value = event.target.value;
    this.onChange(name, value);
  }

  onFormSubmit(event) {
    event.preventDefault();

    if (!this.state.form.name || !this.state.form.email) {
      this.setState({ error: "Name and Email are required." });
      return;
    }

    console.log("Submitting form with data:", this.state.form);

    user
      .edit(this.state.id, this.state.form)
      .then(() => {
        console.log("User updated successfully!");
        this.setState({ blocking: false }, () => {
          console.log("Navigating to /user...");
          this.props.history.push("/user");
        });
      })
      .catch((error) => {
        console.error("Error saving user:", error);
        this.setState({
          error: "Failed to save user data.",
        });
      });
  }

  render() {
    if (!this.state.init) {
      return <div>Loading...</div>;
    }

    return (
      <section className="section">
        <div className="container">
          <h1 className="name">Edit User</h1>
          {this.state.error && (
            <div className="notification is-danger">{this.state.error}</div>
          )}
          <form name="contact" method="POST" onSubmit={this.onFormSubmit}>
            <div className="field">
              <label className="name">Name</label>
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
              <label className="email">Email</label>
              <div className="control">
                <input
                  name="email"
                  className="input"
                  type="email"
                  required
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
                  type="password"
                  value={this.state.form.password}
                  onChange={this.onFormChange}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Phone</label>
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
                  Save User
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

export default UserEdit;
