import React, { Component } from 'react';
import { session } from '../../lib/api';

class Logout extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        session.logout()
            .then(() => {
                this.props.onLogout();
                this.props.history.push("/");
            });
    }

    render() {
        return null;
    }
}

export default Logout;
