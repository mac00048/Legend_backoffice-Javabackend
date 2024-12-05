import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { withRouter } from "react-router";
import { FaUserCircle } from "react-icons/fa";

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };

    this.data = {
      items: [
        { href: "/activity", title: "Activities" },
        { href: "/voucher", title: "Vouchers" },
        { href: "/user", title: "Users" },
      ],
    };

    this.onToggleMenu = this.onToggleMenu.bind(this);
    this.onMenuEntryClick = this.onMenuEntryClick.bind(this);
  }

  onToggleMenu() {
    this.setState((prevState) => {
      return {
        open: !prevState.open,
      };
    });
  }

  onMenuEntryClick() {
    this.setState({
      open: false,
    });
  }

  render() {
    const location = this.props.location.pathname;
    const menuToggle = this.state.open ? " is-active" : "";

    return (
      <nav
        className="navbar is-link"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="container">
          <div className="navbar-brand">
            <NavLink to="/" className="navbar-item">
              <img src={require("../assets/logo-motto-inline.png").default} />
            </NavLink>
            {this.props.user && (
              <a
                role="button"
                className={"navbar-burger burger" + menuToggle}
                aria-label="menu"
                aria-expanded="false"
                data-target="navbarBasicExample"
                onClick={this.onToggleMenu}
              >
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
              </a>
            )}
          </div>
          {this.props.user && (
            <div id="navbarBasicExample" className={"navbar-menu" + menuToggle}>
              <div className="navbar-end">
                {this.data.items.map((item) => {
                  if (
                    item.title === "Users" &&
                    this.props.user.role !== "Admin"
                  ) {
                    return null;
                  }
                  return (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      onClick={this.onMenuEntryClick}
                      className={
                        "navbar-item " +
                        (location === item.href ? " is-active" : "")
                      }
                    >
                      {item.title}
                    </NavLink>
                  );
                })}

                <div
                  className="navbar-item has-dropdown is-hoverable"
                  style={{ marginLeft: "20px" }}
                >
                  <a
                    className="navbar-link"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <span
                      className="icon is-medium"
                      style={{ marginRight: "4px" }}
                    >
                      <FaUserCircle className="icon" />
                    </span>
                    <span>{this.props.user.name.split(" ")[0]}</span>
                  </a>

                  <div className="navbar-dropdown is-right">
                    {/*
                                    <a className="navbar-item">
                                        Profile
                                    </a>
                                    <a className="navbar-item">
                                        Change password
                                    </a>   
                                    <hr className="navbar-divider" />
                                    */}
                    <NavLink
                      to="/logout"
                      onClick={this.onMenuEntryClick}
                      className="navbar-item"
                    >
                      Logout
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    );
  }
}

export default withRouter(Header);
