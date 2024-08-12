import React, { Component } from 'react';
import { FaUpload } from 'react-icons/fa';
import { file } from '../../lib/api';

class ImageEditor extends Component {

    constructor(props) {
        super(props);
        
        this.onAddImage = this.onAddImage.bind(this);
        this.onRemoveImage = this.onRemoveImage.bind(this);
        this.onFormChange = this.onFormChange.bind(this);
    }

    onAddImage(event) {
        const formData = new FormData();
        formData.append('file', event.target.files[0]);

        file.add(formData)
            .then(file => {
                const images = this.props.images.slice();

                images.push({
                    fileId: file.id,
                    title: ""
                });

                this.props.onChange(images);
            })
            .catch(error => {
                // TODO
                throw error;
            });
    }

    onRemoveImage(event, fileId) {
        const images = this.props.images.filter(image => image.fileId != fileId);
        this.props.onChange(images);
    }

    onFormChange(event, fileId) {
        const name = event.target.name;
        const value = event.target.value;

        const images = this.props.images.map(image => {
            if (image.fileId === fileId) {
                return {
                    ...image,
                    [name]: value
                }
            } else {
                return image;
            }
        });

        this.props.onChange(images);
    }

    render() {
        const height = 150;

        return (
            <div style={{ display: 'flex', flex: 1, flexWrap: 'wrap' }}>
                {this.props.images.map(image =>
                    <div key={image.fileId} style={{ marginRight: '20px', marginBottom: '20px', height: `${height}px`, position: 'relative' }}>
                        <img src={`/api/file/${image.fileId}/thumbnail/${height}`} style={{ margin: 0, borderRadius: '5px' }} />
                        <button className="modal-close is-medium" style={{ position: 'absolute', top: '8px', right: '8px' }} onClick={event => this.onRemoveImage(event, image.fileId)}/>
                        <input
                            name="title"
                            className="input"
                            type="text"
                            placeholder="Caption"
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                border: 0,
                                boxShadow: 0,
                                borderRadius: 0,
                                backgroundColor: 'rgba(255, 255, 255, 0.8)'
                            }}
                            value={image.title}
                            onChange={event => this.onFormChange(event, image.fileId)}
                        />
                    </div>
                )}

                <div style={{ marginBottom: '20px', height: `${height}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'whitesmoke' }}>
                    <div className="file is-boxed">
                        <label className="file-label">
                            <input className="file-input" name="files" type="file" accept="image/*" onChange={this.onAddImage} />
                            <span className="file-cta" style={{ border: 'none' }}>
                                <span className="file-icon">
                                    <FaUpload />
                                </span>
                                <span className="file-label">
                                    Choose an image…
                                </span>
                            </span>
                        </label>
                    </div>
                </div>
            </div>
        );
    }
}

export default ImageEditor;
