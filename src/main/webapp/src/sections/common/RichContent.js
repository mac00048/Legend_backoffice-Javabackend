import React, { Component } from 'react';
import { empty } from '../../lib/helpers';

class RichContent extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        if (!this.props.value || this.props.value.length === 0) {
            return empty();
        }

        return (
            <div
                dangerouslySetInnerHTML={{ __html: this.props.value }}
                className="reset"
                style={{
                    maxHeight: '20em',
                    padding: '1em',
                    marginBottom: '1em',
                    overflowY: 'scroll',
                    backgroundColor: '#FAFAFA',
                    border: '1px solid #dbdbdb',
                    borderRadius: '4px'
                }}
            />
        );
    }
}

export default RichContent;
