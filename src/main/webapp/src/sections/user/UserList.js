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
    };

    this.onQueryChange = this.onQueryChange.bind(this);
    this.debouncedSearch = debounce(this.search.bind(this), 500);
  }

  componentDidMount() {
    this.search();
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

  onActivityClick(id) {
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
                    onClick={() => this.onColumnClick("title")}
                  >
                    Name
                    {this.state.orderBy === "title" && (
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
                    {this.state.orderBy !== "title" && (
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
                    onClick={() => this.onColumnClick("subtitle")}
                  >
                    Email
                    {this.state.orderBy === "subtitle" && (
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
                    {this.state.orderBy !== "subtitle" && (
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
                  {/* <th
                    className="is-nowrap is-unselectable is-hidden-mobile"
                    style={{ cursor: "pointer" }}
                    onClick={() => this.onColumnClick("created_at")}
                  >
                    Creation Date
                    {this.state.orderBy === "created_at" && (
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
                    {this.state.orderBy !== "created_at" && (
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
                  </th> */}
                  <th className="is-nowrap"></th>
                </tr>
              </thead>
              <tbody>
                {this.state.data.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => this.onActivityClick(item.id)}
                  >
                    <td className="is-nowrap">{item.email}</td>
                    {/* <td className="is-nowrap is-hidden-mobile">
                      {item.subtitle}
                    </td>
                    <td className="is-nowrap is-hidden-mobile">
                      {format(
                        parseISO(item.createdAt),
                        "yyyy-MM-dd HH:mm:ss xxx"
                      )}
                    </td> */}
                    <td className="is-fit is-nowrap has-text-right">
                      <a className="has-text-grey">
                        <span className="icon">
                          <FaAngleRight />
                        </span>
                      </a>
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
