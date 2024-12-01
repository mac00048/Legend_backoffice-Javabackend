import React, { Component } from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import history from "./lib/history";
import { session } from "./lib/api";

import "./App.scss";

import Header from "./sections/Header";
import Home from "./sections/Home";
import Footer from "./sections/Footer";
import Login from "./sections/session/Login";
import Logout from "./sections/session/Logout";
import ActivityList from "./sections/activity/ActivityList";
import ActivityDetails from "./sections/activity/ActivityDetails";
import ActivityAdd from "./sections/activity/ActivityAdd";
import ActivityEdit from "./sections/activity/ActivityEdit";
import ActivityDayAdd from "./sections/activity/day/ActivityDayAdd";
import ActivityDayEdit from "./sections/activity/day/ActivityDayEdit";
import VoucherList from "./sections/voucher/VoucherList";
import BackToTop from "./lib/BackToTop";
import VoucherAdd from "./sections/voucher/VoucherAdd";
import VoucherDetails from "./sections/voucher/VoucherDetails";
import VoucherEdit from "./sections/voucher/VoucherEdit";
import UserList from "./sections/user/UserList";
import UserAdd from "./sections/user/UserAdd";
import UserEdit from "./sections/user/UserEdit";
import { FaUserEdit } from "react-icons/fa";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      loading: true,
    };

    this.onLogin = this.onLogin.bind(this);
    this.onLogout = this.onLogout.bind(this);
  }

  componentDidMount() {
    session
      .get()
      .then((user) =>
        this.setState({
          user: user,
          loading: false,
        })
      )
      .catch((error) =>
        this.setState({
          user: null,
          loading: false,
        })
      );
  }

  onLogin(user) {
    this.setState({
      user: user,
    });
  }

  onLogout() {
    this.setState({
      user: null,
    });
  }

  render() {
    // https://medium.com/@melih193/react-with-react-router-5-9bdc9d427bfd
    const PrivateRoute = ({ component: Component, ...rest }) => {
      return (
        <Route
          {...rest}
          render={(props) =>
            this.state.user !== null ? (
              <Component {...props} />
            ) : (
              <Redirect to={{ pathname: "/login" }} />
            )
          }
        />
      );
    };

    // TODO
    if (this.state.loading) {
      return <h1>Loading...</h1>;
    }

    return (
      <Router history={history}>
        <Header user={this.state.user} onLogout={this.onLogout} />
        <Switch>
          <Route
            path="/login"
            render={(routeProps) => (
              <Login onLogin={this.onLogin} {...routeProps} />
            )}
          />
          <Route
            path="/logout"
            render={(routeProps) => (
              <Logout onLogout={this.onLogout} {...routeProps} />
            )}
          />

          <PrivateRoute
            path="/activity/:activityId/day/add"
            component={ActivityDayAdd}
            onEnter={this.requireAuthentication}
          />
          <PrivateRoute
            path="/activity/:activityId/day/:id/edit"
            component={ActivityDayEdit}
            onEnter={this.requireAuthentication}
          />

          <PrivateRoute
            path="/activity/add"
            component={ActivityAdd}
            onEnter={this.requireAuthentication}
          />
          <PrivateRoute
            path="/activity/:id/edit"
            component={ActivityEdit}
            onEnter={this.requireAuthentication}
          />
          <PrivateRoute
            path="/activity/:id"
            component={ActivityDetails}
            onEnter={this.requireAuthentication}
          />
          <PrivateRoute
            path="/activity"
            component={ActivityList}
            onEnter={this.requireAuthentication}
          />
          <PrivateRoute
            path="/user"
            component={UserList}
            exact
            onEnter={this.requireAuthentication}
          />
          <PrivateRoute
            path="/user/add"
            exact
            component={UserAdd}
            onEnter={this.requireAuthentication}
          />
          <PrivateRoute
            path="/user/:id/edit"
            component={UserEdit}
            onEnter={this.requireAuthentication}
          />

          <PrivateRoute
            path="/voucher/add"
            component={VoucherAdd}
            onEnter={this.requireAuthentication}
          />
          <PrivateRoute
            path="/voucher/:id/edit"
            component={VoucherEdit}
            onEnter={this.requireAuthentication}
          />
          <PrivateRoute
            path="/voucher/:id"
            component={VoucherDetails}
            onEnter={this.requireAuthentication}
          />
          <PrivateRoute
            path="/voucher"
            component={VoucherList}
            onEnter={this.requireAuthentication}
          />

          <PrivateRoute
            path="/"
            component={Home}
            onEnter={this.requireAuthentication}
          />
        </Switch>
        <Footer />
        <BackToTop />
      </Router>
    );
  }
}

export default App;
