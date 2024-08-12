import React, { Component } from 'react';
import { FaPlus, FaPencilAlt, FaTimes } from 'react-icons/fa';
import { format, parseISO } from 'date-fns'
import { activityDay } from '../../../lib/api';
import { display, displayText, empty } from '../../../lib/helpers';
import { withRouter } from "react-router";
import ImageList from '../../common/ImageList';
import Map from '../../common/Map'
import RichContent from '../../common/RichContent';

class ActivityDayList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            current: null,
            delete: false
        };

        this.onDelete = this.onDelete.bind(this);
    }
    
    componentDidMount() {
        activityDay.list(this.props.activityId)
            .then(json => {
                this.setState({
                    data: json,
                    current: json.length > 0 ? 0 : null
                });
            })
            .catch(error => {
                this.setState({
                    data: [],
                    current: null
                });
            });
    }

    onDelete(id) {
        event.preventDefault();

        if (!this.state.delete) {
            this.setState({
                delete: true
            });

            return;
        }

        activityDay.remove(this.props.activityId, id)
            .then(() => {
                this.setState({
                    delete: false
                });

                // this is wrong
                this.componentDidMount();
            })
            .catch(error => {
                this.setState({
                    error: true
                });
            });
    }

    render() {
        var day = null;
        
        if (this.state.current != null && this.state.data.length >= this.state.current) {
            day = this.state.data[this.state.current];
        }

        return (
            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                <div id="days" className="columns is-vcentered is-mobile">
                    <div className="column">
                        <h3 className="title" style={{ margin: 0 }}>Activity Days</h3>
                    </div>
                    <div className="column has-text-right">
                        <button className="button is-link" onClick={() => this.props.history.push(`/activity/${this.props.activityId}/day/add`)}>
                            <span className="icon">
                                <FaPlus/>
                            </span>
                            <span>Add Day</span>
                        </button>
                    </div>
                </div>
                <div className="content">
                    <div className="tabs is-boxed" style={{ margin: 0 }}>
                        <ul style={{ margin: '0' }}>
                            {this.state.data.map((item, i) =>
                                <li key={item.id} id={`day-${i+1}`} className={this.state.current === i ? "is-active" : ""} style={{ marginLeft: i == 0 && '1em' }} onClick={() => this.setState({ current: i, delete: false })}><a>Day {i+1}</a></li>
                            )}
                        </ul>
                    </div>
                    {day &&
                    <div style={{ border: '1px solid #dbdbdb', borderTop: 0, padding: '1.5em 2em' }}>
                        <div className="buttons is-pulled-right">
                            <button className={ "button is-danger" + (this.state.delete ? "" : " is-light") }  onClick={() => this.onDelete(day.id)}>
                                <span className="icon">
                                    <FaTimes />
                                </span>
                                <span>{ this.state.delete ? "Are you sure?" : "Delete" }</span>
                            </button>
                            <button className="button is-link" onClick={() => this.props.history.push(`/activity/${this.props.activityId}/day/${day.id}/edit`)}>
                                <span className="icon">
                                    <FaPencilAlt />
                                </span>
                                <span>Edit</span>
                            </button>
                        </div>

                        <span className="is-size-5">Title</span>
                        { display(day.title) }
                        
                        <span className="is-size-5">Description</span>
                        <RichContent value={day.description} />

                        <span className="is-size-5">Images</span>
                        <ImageList images={day.images} />

                        <span className="is-size-5">Track</span>
                        {(day.track || (day.markers && day.markers.length > 0)) &&
                            <div style={{ width: '100%', height: '400px' }}>
                                <Map
                                    key={`map-${day.id}`}
                                    routes={day.track && day.track.routes}
                                    markers={day.markers}
                                />
                            </div>
                        }
                        {day.track &&
                            <p>
                                <a href={`/api/file/${day.track.fileId}/download`}>Download</a>
                            </p>
                        }
                        {!day.track && empty()}

                        <span className="is-size-5">Markers</span>
                        <div className="content">
                            {day.markers && day.markers.length > 0 &&
                            <table className="table is-fullwidth">
                                <thead>
                                    <tr>
                                        <th className="is-nowrap">Type</th>
                                        <th className="is-nowrap">Latitude</th>
                                        <th className="is-nowrap">Longitude</th>
                                        <th className="is-nowrap">Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {day.markers.map((item, i) =>
                                        <tr key={i}>
                                            <td className="is-nowrap">{item.type}</td>
                                            <td className="is-nowrap">{item.latitude}</td>
                                            <td className="is-nowrap">{item.longitude}</td>
                                            <td className="is-nowrap">{item.description}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            }
                            {(!day.markers || day.markers.length === 0) && empty()}
                        </div>

                        <span className="is-size-5">Directions</span>
                        <RichContent value={day.directions} />
                    </div>
                    }
                    {!day && empty()}
                </div>
            </div>
        );
    }
}

export default withRouter(ActivityDayList);
