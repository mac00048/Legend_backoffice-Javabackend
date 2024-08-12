import React, { Component } from 'react';
import { Redirect } from "react-router-dom";

class Home extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Redirect to={{ pathname: "/activity" }} />
        );
    }
}

export default Home;
