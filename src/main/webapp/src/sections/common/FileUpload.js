import React, { Component } from 'react';
import { FaUpload } from 'react-icons/fa';
import { file } from '../../lib/api';

class FileUpload extends Component {

    constructor(props) {
        super(props);

        this.state = {
            file: null,
            existing: this.props.file && true
        };
        
        this.onFileChange = this.onFileChange.bind(this);
    }

    onFileChange(event) {
        const formData = new FormData();
        formData.append('file', event.target.files[0]);

        file.add(formData)
            .then(file => {
                this.setState({ file: file });
                this.props.onChange({ fileId: file.id });
            })
            .catch(error => {
                this.setState({
                    error: true
                });
            });
    }

    render() {
        return (
            <div className={`file ${(this.state.file || this.state.existing) && "has-name"}`}>
                <label className="file-label">
                    <input className="file-input" name="files" type="file" accept={this.props.accept} onChange={this.onFileChange} />
                    <span className="file-cta">
                        <span className="file-icon">
                            <FaUpload />
                        </span>
                        <span className="file-label">
                            Choose a file…
                        </span>
                    </span>
                    {this.state.file &&
                        <span className="file-name">
                            {this.state.file.name}
                        </span>
                    }
                    {!this.state.file && this.state.existing &&
                        <span className="file-name">
                            <i>Previously uploaded file.</i>
                        </span>
                    }
                </label>
            </div>
        );
    }
}

export default FileUpload;
