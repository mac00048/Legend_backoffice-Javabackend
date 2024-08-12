import React, { Component } from 'react';
import { FaUpload } from 'react-icons/fa';
import { file } from '../../lib/api';

class FileUploadBasic extends Component {

    constructor(props) {
        super(props);
    }

    onFileChange(event) {
        const formData = new FormData();
        formData.append('file', event.target.files[0]);

        file.add(formData)
            .then(file => {
                this.props.onChange(file);
            })
            .catch(error => {
                console.log(error);
            });
    }

    render() {
        return (
            <div className="file">
                <label className="file-label">
                    <input className="file-input" name="files" type="file" accept={this.props.accept} onChange={this.onFileChange.bind(this)} />
                    <span className="file-cta">
                        <span className="file-icon">
                            <FaUpload />
                        </span>
                        <span className="file-label">
                            Choose a file…
                        </span>
                    </span>
                </label>
            </div>
        );
    }
}

export default FileUploadBasic;
