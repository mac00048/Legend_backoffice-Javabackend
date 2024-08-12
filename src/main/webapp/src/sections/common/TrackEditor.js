import React, { Component } from 'react';
import FileUploadBasic from './FileUploadBasic';
import { FaTimes } from 'react-icons/fa';
import { file } from '../../lib/api';

class TrackEditor extends Component {

    constructor(props) {
        super(props);

        this.state = {
            files: []
        };

        this.onAddFile = this.onAddFile.bind(this);
        this.onDeleteFile = this.onDeleteFile.bind(this);
    }

    componentDidMount() {
        if (!this.props.track || !this.props.track.files) {
            return;
        }

        this.props.track.files.forEach(id => {
            file.get(id)
                .then(json => {
                    this.setState(prevState => {
                        return {
                            files: [
                                ...prevState.files,
                                json
                            ]
                        };
                    });
                })
                .catch(error => console.error(error));
        });
    }

    onAddFile(file) {
        this.setState(prevState => {
            return {
                files: [
                    ...prevState.files,
                    file
                ]
            };
        }, () => {
            this.props.onChange({ files: this.state.files.map(file => file.id) });
        });
    }

    onDeleteFile(id) {
        this.setState(prevState => {
            return {
                files: prevState.files.filter(file => file.id != id)
            };
        }, () => {
            this.props.onChange({ files: this.state.files.map(file => file.id) });
        });
    }

    render() {
        return (
            <div className="files">
                {this.state.files.map(file =>
                    <div key={file.id} className="file" style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <div className="tag is-medium" style={{ marginRight: '8px' }}>{file.name}</div>
                        <button type="button" className="button is-small is-light is-danger" onClick={() => this.onDeleteFile(file.id)}>
                            <span className="icon">
                                <FaTimes />
                            </span>
                        </button>
                    </div>
                )}
                <FileUploadBasic key={Math.random()} accept=".gpx" onChange={this.onAddFile} />
            </div>
        );
    }
}

export default TrackEditor;
