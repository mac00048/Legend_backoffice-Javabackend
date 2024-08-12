import React, { Component } from 'react';
import { format } from 'date-fns'
import { voucher, activity } from '../../lib/api';
import NavigationBlocker from '../common/NavigationBlocker';

class VoucherAdd extends Component {

    constructor(props) {
        super(props);

        this.state = {
            form: {
                activityId: "",
                startDate: format(new Date(), 'yyyy-MM-dd'),
                clientName: "",
                clientPhone: "",
                clientEmail: ""
            },
            activities: [],
            init: false,
            blocking: true,
            error: false
        };
        
        this.onFormChange = this.onFormChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    componentDidMount() {
        activity.list()
            .then(json => {
                this.setState(prevState => {
                    return {
                        form: {
                            ...prevState.form,
                            activityId: json.length > 0 ? json[0].id : ""
                        },
                        activities: json,
                        init: true
                    };
                });
            })
            .catch(error => {
                this.setState(prevState => {
                    return {
                        form: {
                            ...prevState.form,
                            activityId: ""
                        },
                        activities: []
                    };
                });
            });
    }

    onFormChange(event) {
        const name = event.target.name;
        const value = event.target.value;

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

    onFormSubmit(event) {
        event.preventDefault();

        voucher.add(this.state.form)
            .then(json => {
                this.setState({ blocking: false }, () => this.props.history.push(`/voucher`));
            })
            .catch(error => {
                this.setState({
                    error: true
                });
            });
    }

    render() {
        if (!this.state.init) {
            return null;
        }

        const form = this.state.form;

        return (
            <section className="section">
                <div className="container">
                    <h1 className="title">Add Voucher</h1>

                    <form name="contact" method="POST" onSubmit={this.onFormSubmit}>
                        <div className="field">
                            <label className="label">Activity</label>
                            <div className="control">
                                <div className="select is-fullwidth">
                                    <select name="activityId" required value={form.activityId} onChange={this.onFormChange}>
                                        {this.state.activities.map(activity =>
                                            <option key={activity.id} value={activity.id}>{activity.title}{activity.subtitle && ` - ${activity.subtitle}`}</option>
                                        )}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Start Date</label>
                            <div className="control">
                                <input name="startDate" required className="input" type="date" value={form.startDate} onChange={this.onFormChange}/>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Client Name</label>
                            <div className="control">
                                <input name="clientName" required className="input" type="text" value={form.clientName} onChange={this.onFormChange}/>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Client Phone</label>
                            <div className="control">
                                <input name="clientPhone" className="input" type="tel" value={form.clientPhone} onChange={this.onFormChange}/>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Client Email</label>
                            <div className="control">
                                <input name="clientEmail" className="input" type="email" value={form.clientEmail} onChange={this.onFormChange}/>
                            </div>
                        </div>
                        <div className="field is-grouped">
                            <div className="control">
                                <button type="submit" className="button is-link">Add Voucher</button>
                            </div>
                            <div className="control">
                                <button type="button" className="button is-light" onClick={() => this.props.history.push("/voucher")}>Cancel</button>
                            </div>
                        </div>
                    </form>
                    <NavigationBlocker enabled={this.state.blocking} data={this.state.form} />
                </div>
            </section>
        );
    }
}

export default VoucherAdd;
