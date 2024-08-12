import React, { Component } from 'react';
import { activityDay } from '../../../lib/api';
import ImageEditor from '../../common/ImageEditor';
import TrackEditor from '../../common/TrackEditor';
import MarkerEditor from '../../common/MarkerEditor';
import RichEditor from '../../common/RichEditor';
import NavigationBlocker from '../../common/NavigationBlocker';

class ActivityDayAdd extends Component {

    constructor(props) {
        super(props);

        this.state = {
            form: {
                activityId: this.props.match.params.activityId,
                title: "",
                description: "",
                directions: "",
                images: [],
                track: null,
                markers: []
            },
            blocking: true,
            error: false
        };
        
        this.onChange = this.onChange.bind(this);
        this.onFormChange = this.onFormChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    onChange(name, value) {
        this.setState(prevState => {
            return {
                form: {
                    ...prevState.form,
                    [name]: value
                },
                error: false
            };
        });
    }

    onFormChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.onChange(name, value);
    }

    onFormSubmit(event) {
        event.preventDefault();

        activityDay.add(this.props.match.params.activityId, this.state.form)
            .then(json => {
                this.setState({ blocking: false }, () => this.props.history.push(`/activity/${this.props.match.params.activityId}`));
            })
            .catch(error => {
                this.setState({
                    error: true
                });
            });
    }

    render() {
        return (
            <section className="section">
                <div className="container">
                    <h1 className="title">Add Day</h1>

                    <form name="contact" method="POST" onSubmit={this.onFormSubmit}>
                        <div className="field">
                            <label className="label">Title</label>
                            <div className="control">
                                <input name="title" className="input" type="text" required value={this.state.form.title} onChange={this.onFormChange}/>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Description</label>
                            <div className="control">
                                <RichEditor value={this.state.form.description} onChange={(value) => this.onChange("description", value)} />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Images</label>
                            <div className="control">
                                <ImageEditor images={this.state.form.images} onChange={(images) => this.onChange("images", images)}/>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Track</label>
                            <div className="control">
                                <TrackEditor track={this.state.form.track} onChange={(track) => this.onChange("track", track)}/>
                            </div>
                            <p className="help is-info">Origin and Destination markers will be automatically created based on track.</p>
                        </div>
                        <div className="field">
                            <label className="label">Markers</label>
                            <div className="control">
                                <MarkerEditor markers={this.state.form.markers} onChange={(markers) => this.onChange("markers", markers)}/>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Directions</label>
                            <div className="control">
                                <RichEditor value={this.state.form.directions} onChange={(value) => this.onChange("directions", value)} />
                            </div>
                        </div>
                        <div className="field is-grouped">
                            <div className="control">
                                <button type="submit" className="button is-link">Add Day</button>
                            </div>
                            <div className="control">
                                <button type="button" className="button is-light" onClick={() => this.props.history.push(`/activity/${this.props.match.params.activityId}`)}>Cancel</button>
                            </div>
                        </div>
                    </form>
                    <NavigationBlocker enabled={this.state.blocking} data={this.state.form} />
                </div>
            </section>
        );
    }
}

export default ActivityDayAdd;
