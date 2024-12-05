import React, { Component } from "react";
import {
  FaAngleRight,
  FaPlus,
  FaSearch,
  FaSortUp,
  FaSortDown,
  FaSort,
} from "react-icons/fa";
import { format, parseISO } from "date-fns";
import { activity } from "../../lib/api";
import { user } from "../../lib/api";
import { debounce } from "debounce";

class UserList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: "",
      orderBy: "name",
      order: "ASC",
      data: [],
      selectedForDelete: null,
    };

    this.onQueryChange = this.onQueryChange.bind(this);
    this.debouncedSearch = debounce(this.search.bind(this), 500);
    this.onDelete = this.onDelete.bind(this);
  }

  componentDidMount() {
    this.search();
  }

  onDelete(event, id) {
    event.preventDefault();

    if (this.state.selectedForDelete !== id) {
      this.setState({
        selectedForDelete: id,
      });
      return;
    }

    user
      .remove(id)
      .then(() => {
        this.setState({
          selectedForDelete: null, 
          data: this.state.data.filter((item) => item.id !== id), 
        });
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
        this.setState({
          selectedForDelete: null, 
          error: true,
        });
      });
  }

  onQueryChange(event) {
    this.setState(
      {
        query: event.target.value,
      },
      this.debouncedSearch
    );
  }

  search() {
    user
      .list(this.state.query, this.state.orderBy, this.state.order)
      .then((json) => {
        this.setState({
          data: json,
        });
      })
      .catch((error) => {
        this.setState({
          data: [],
        });
      });
  }

  onColumnClick(column) {
    this.setState((prevState) => {
      return {
        orderBy: column,
        order:
          prevState.orderBy === column
            ? prevState.order === "ASC"
              ? "DESC"
              : "ASC"
            : "ASC",
      };
    }, this.search);
  }

  onEditClick(id) {
    this.props.history.push(`/user/${id}/edit`);
  }

  render() {
    return (
      <section className="section">
        <div className="container">
          <div className="columns is-vcentered is-mobile">
            <div className="column">
              <h1 className="title">Users</h1>
            </div>
            <div className="column has-text-right">
              <button
                className="button is-link"
                onClick={() => {
                  console.log("Add User button clicked");
                  this.props.history.push("/user/add");
                }}
              >
                <span className="icon">
                  <FaPlus />
                </span>
                <span>Add User</span>
              </button>
            </div>
          </div>
          <div className="content">
            <table className="table is-striped is-hoverable is-fullwidth">
              <thead>
                <tr>
                  <th
                    className="is-nowrap is-unselectable"
                    style={{ cursor: "pointer" }}
                    onClick={() => this.onColumnClick("name")}
                  >
                    Name
                    {this.state.orderBy === "name" && (
                      <span
                        className=""
                        style={{
                          verticalAlign: "middle",
                          color: "#AAA",
                          marginLeft: "3px",
                        }}
                      >
                        {this.state.order === "ASC" ? (
                          <FaSortUp />
                        ) : (
                          <FaSortDown />
                        )}
                      </span>
                    )}
                    {this.state.orderBy !== "name" && (
                      <span
                        className=""
                        style={{
                          verticalAlign: "middle",
                          color: "#EEE",
                          marginLeft: "3px",
                        }}
                      >
                        <FaSort />
                      </span>
                    )}
                  </th>
                  <th
                    className="is-nowrap is-unselectable is-hidden-mobile"
                    style={{ cursor: "pointer" }}
                    onClick={() => this.onColumnClick("email")}
                  >
                    Email
                    {this.state.orderBy === "email" && (
                      <span
                        className=""
                        style={{
                          verticalAlign: "middle",
                          color: "#AAA",
                          marginLeft: "3px",
                        }}
                      >
                        {this.state.order === "ASC" ? (
                          <FaSortUp />
                        ) : (
                          <FaSortDown />
                        )}
                      </span>
                    )}
                    {this.state.orderBy !== "email" && (
                      <span
                        className=""
                        style={{
                          verticalAlign: "middle",
                          color: "#EEE",
                          marginLeft: "3px",
                        }}
                      >
                        <FaSort />
                      </span>
                    )}
                  </th>
                  <th
                    className="is-nowrap is-unselectable is-hidden-mobile"
                    style={{ cursor: "pointer" }}
                    onClick={() => this.onColumnClick("role")}
                  >
                    Role
                    {this.state.orderBy === "role" && (
                      <span
                        className=""
                        style={{
                          verticalAlign: "middle",
                          color: "#AAA",
                          marginLeft: "3px",
                        }}
                      >
                        {this.state.order === "ASC" ? (
                          <FaSortUp />
                        ) : (
                          <FaSortDown />
                        )}
                      </span>
                    )}
                    {this.state.orderBy !== "role" && (
                      <span
                        className=""
                        style={{
                          verticalAlign: "middle",
                          color: "#EEE",
                          marginLeft: "3px",
                        }}
                      >
                        <FaSort />
                      </span>
                    )}
                  </th>
                  <th className="is-nowrap has-text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {this.state.data.map((item) => (
                  <tr key={item.id}>
                    <td className="is-nowrap">{item.name}</td>
                    <td className="is-nowrap is-hidden-mobile">{item.email}</td>
                    <td className="is-nowrap is-hidden-mobile">{item.role}</td>
                    <td className="is-fit is-nowrap has-text-right">
                      <button
                        className="button is-small is-info"
                        onClick={() =>
                          this.props.history.push(`/user/${item.id}/edit`)
                        }
                        style={{ marginRight: "5px" }}
                      >
                        Edit
                      </button>
                      <button
                        className={
                          "button is-small " +
                          (this.state.selectedForDelete === item.id
                            ? "is-danger"
                            : "is-danger is-light")
                        }
                        onClick={(event) => this.onDelete(event, item.id)}
                      >
                        <span>
                          {this.state.selectedForDelete === item.id
                            ? "Are you sure?"
                            : "Delete"}
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    );
  }
}

export default UserList;
