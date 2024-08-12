import React, { Component } from 'react';
import ReactMapGL, { Marker, Source, Layer } from 'react-map-gl';
import WebMercatorViewport from 'viewport-mercator-project';
import { lineString } from '@turf/helpers';
import { FaMapMarkerAlt } from 'react-icons/fa';

class Map extends Component {

    constructor(props) {
        super(props);

        this.state = {
            viewport: this.computeInitialBounds(),
            mounted: false
        };
        
        this.computeInitialBounds = this.computeInitialBounds.bind(this);
        this.renderRoutes = this.renderRoutes.bind(this);
        this.renderMarkers = this.renderMarkers.bind(this);
    }

    componentDidMount () {
        this.setState({
            mounted: true
        });
    }

    computeInitialBounds() {
        const coordinates = [];

        if (this.props.markers) {
            coordinates.push(...this.props.markers);
        }

        if (this.props.routes) {
            this.props.routes.forEach(route => {
                coordinates.push(...route); 
            });
        }

        if (!coordinates.length) {
            return {
                bounds: {
                    ne: [-180, 90],
                    sw: [180, -90]
                }
            };
        }

        const ne = [
            coordinates.reduce((min, point) => Math.min(min, point.longitude), 180),
            coordinates.reduce((max, point) => Math.max(max, point.latitude), -180)
        ];

        const sw = [
            coordinates.reduce((max, point) => Math.max(max, point.longitude), -180),
            coordinates.reduce((min, point) => Math.min(min, point.latitude), 180)
        ];

        // TODO wrong ratio
        const wmViewport = new WebMercatorViewport({ width: 800, height: 400 });
        const viewport = wmViewport.fitBounds([ne, sw], { padding: 50 });

        return {
            latitude: viewport.latitude,
            longitude: viewport.longitude,
            zoom: viewport.zoom > 14 ? 14 : viewport.zoom
        };
    }

    renderRoutes() {
        const routes = [];

        if (!this.props.routes) {
            return;
        }

        this.props.routes.map((route, i) => {
            const line = lineString(route.map(point => [ point.longitude, point.latitude ]));

            routes.push(
                <Source key={`route-${i}`} type="geojson" data={line}>
                    <Layer
                        type="line"
                        paint={{
                            'line-color': "#3F51B5",
                            'line-width': 4,
                            'line-opacity': 0.8
                        }} 
                    />
                </Source>
            );
        });

        return routes;
    }

    renderMarkers() {
        const markers = [];

        if (!this.props.markers) {
            return;
        }

        this.props.markers.map((marker, i) => {
            markers.push(
                <Marker key={`marker-${i}`} latitude={marker.latitude} longitude={marker.longitude} offsetLeft={-12} offsetTop={-24}>
                    <span className="icon" style={{ cursor: "pointer" }} title={marker.description}>
                        <FaMapMarkerAlt style={{ width: '1.5em', height: '1.5em'}} />
                    </span>
                </Marker>
            )
        });

        return markers;
    }

    render() {
        return (
            <ReactMapGL
                mapboxApiAccessToken="pk.eyJ1IjoibGVnZW5kYXRvdXIiLCJhIjoiY2szejJ5ZGI4MDR3bjNybW1nM2JkN2RveCJ9.OqvNP8hn3xUrM-5VflkcQw"
                mapStyle="mapbox://styles/mapbox/outdoors-v11"
                width="100%"
                height="100%"
                {...this.state.viewport}
                onViewportChange={(viewport) => this.state.mounted && this.setState({ viewport })}
            >
                {this.renderRoutes()}
                {this.renderMarkers()}
            </ReactMapGL>
        );
    }
}

export default Map;
