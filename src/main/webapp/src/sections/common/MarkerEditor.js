import React, { Component } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';

class MarkerEditor extends Component {

    constructor(props) {
        super(props);

        this.onAddMarker = this.onAddMarker.bind(this);
        this.onRemoveMarker = this.onRemoveMarker.bind(this);
        this.onFormChange = this.onFormChange.bind(this);
    }

    onAddMarker(event) {
        const markers = this.props.markers.slice();

        markers.push({
            type: "POI",
            latitude: "",
            longitude: "",
            description: ""
        });

        this.props.onChange(markers);
    }

    onRemoveMarker(event, index) {
        const markers = this.props.markers.filter((marker, i) => i != index)
        this.props.onChange(markers);
    }

    onFormChange(event, index) {
        const name = event.target.name;
        const value = event.target.value;

        const markers = this.props.markers.map((marker, i) => {
            if (i === index) {
                return {
                    ...marker,
                    [name]: value
                }
            } else {
                return marker;
            }
        });

        this.props.onChange(markers);
    }

    render() {
        return (
            <div>
                {this.props.markers.map((marker, i) =>
                    <div className="field is-horizontal" key={i}>
                        <div className="field-body">
                            <div className="field" style={{maxWidth: '170px'}}>
                                <div className="control">
                                    <div className="select">
                                        <select name="type" value={marker.type} onChange={(event) => this.onFormChange(event, i)}>
                                            <option value="ORIGIN">Origin</option>
                                            <option value="DESTINATION">Destination</option>
                                            <option value="POI">Point of Interest</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="field" style={{maxWidth: '150px'}}>
                                <div className="control">
                                    <input className="input" type="number" step="0.00000001" min="-90" max="90" required name="latitude" placeholder="Latitude" value={marker.latitude} onChange={(event) => this.onFormChange(event, i)} />
                                </div>
                            </div>
                            <div className="field" style={{maxWidth: '150px'}}>
                                <div className="control">
                                    <input className="input" type="number" step="0.00000001" min="-180" max="180" required name="longitude" placeholder="Longitude" value={marker.longitude} onChange={(event) => this.onFormChange(event, i)} />
                                </div>
                            </div>
                            <div className="field" style={{maxWidth: '300px'}}>
                                <div className="control">
                                    <input className="input" type="text" required name="description" placeholder="Description" value={marker.description} onChange={(event) => this.onFormChange(event, i)} />
                                </div>
                            </div>
                            <div className="field">
                                <div className="control buttons">
                                    <button type="button" className="button is-light is-danger" onClick={(event) => this.onRemoveMarker(event, i)}>
                                        <span className="icon">
                                            <FaTimes />
                                        </span>
                                    </button>
                                    {this.props.markers.length === i+1 &&
                                    <button type="button" className="button is-light" onClick={(event) => this.onAddMarker(event)}>
                                        <span className="icon">
                                            <FaPlus />
                                        </span>
                                    </button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {this.props.markers.length == 0 &&
                    <button type="button" className="button is-light" onClick={(event) => this.onAddMarker(event)}>
                        <span className="icon">
                            <FaPlus />
                        </span>
                        <span>Add Marker</span>
                    </button>
                }
            </div>
        );
    }
}

export default MarkerEditor;
