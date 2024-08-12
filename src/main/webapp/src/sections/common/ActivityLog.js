import React, { Component } from 'react';
import { format, parseISO } from 'date-fns'

class ActivityLog extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const data = this.props.data;

        return (
            <>
                { data.createdAt &&
                    <div>Created at {format(parseISO(data.createdAt), 'yyyy-MM-dd HH:mm:ss xxx')} by {data.meta.createdByName}.</div>
                }
                { data.updatedAt &&
                    <div>Updated at {format(parseISO(data.updatedAt), 'yyyy-MM-dd HH:mm:ss xxx')} by {data.meta.updatedByName}.</div>
                }
                { data.deletedAt &&
                    <div>Deleted at {format(parseISO(data.deletedAt), 'yyyy-MM-dd HH:mm:ss xxx')} by {data.meta.deletedByName}.</div>
                }
            </>
        );
    }
}

export default ActivityLog;
