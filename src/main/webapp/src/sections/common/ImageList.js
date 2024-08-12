import React, { Component } from 'react';
import { empty } from '../../lib/helpers';

class ImageList extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const height = 150;

        if (!this.props.images || this.props.images.length === 0) {
            return empty();
        }

        return (
            <div style={{ display: 'flex', flex: 1, flexWrap: 'wrap' }}>
                {this.props.images.map(image =>
                    <div key={image.fileId} style={{ marginRight: '20px', marginBottom: '20px', height: `${height}px`, position: 'relative' }}>
                        <img src={`/api/file/${image.fileId}/thumbnail/${height}`} style={{ margin: 0, borderRadius: '5px' }} />
                        { image.title && 
                            <span className="ellipsis" style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                padding: '5px 10px',
                                textAlign: 'left'
                            }}>
                                {image.title}
                            </span>
                        }
                    </div>
                )}
            </div>
        );
    }
}

export default ImageList;
