import React, { Component } from 'react';
import { Prompt } from 'react-router-dom';
import { withRouter } from "react-router";
import * as deepEqual from "deep-is";

class NavigationBlocker extends Component {

    constructor(props) {
        super(props);

        this.state = {
            initial: props.data
        };
    }

    render() {
        return (
            <Prompt
                when={this.props.enabled && !deepEqual(this.state.initial, this.props.data)}
                message={() => {
                    return "You have unsaved changes.\nDo you really want to leave this page?";
                }}
            />
        );
    }
}

export default withRouter(NavigationBlocker);
