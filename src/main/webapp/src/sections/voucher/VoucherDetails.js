import React, { Component } from 'react';
import { format, parseISO } from 'date-fns'
import { FaPencilAlt, FaTimes, FaSync, FaUndo } from 'react-icons/fa';
import { voucher, activity } from '../../lib/api';
import { display, empty } from '../../lib/helpers';
import ActivityLog from '../common/ActivityLog';

class VoucherDetails extends Component {

    constructor(props) {
        super(props);

        this.state = {
            id: this.props.match.params.id,
            data: null,
            delete: false
        };

        this.onDelete = this.onDelete.bind(this);
        this.onReset = this.onReset.bind(this);
        this.onUnredeem = this.onUnredeem.bind(this);
    }
    
    componentDidMount() {
        voucher.get(this.state.id)
            .then(json => {
                this.setState({
                    data: json,
                });
            })
            .catch(error => this.setState({
                data: null
            }));
    }

    onDelete(event) {
        event.preventDefault();

        if (!this.state.delete) {
            this.setState({
                delete: true
            });

            return;
        }

        voucher.remove(this.state.id)
            .then(() => {
                this.props.history.push(`/voucher`);
            })
            .catch(error => {
                this.setState({
                    error: true
                });
            });
    }

    onReset(event) {
        event.preventDefault();

        voucher.reset(this.state.id)
            .then(() => {
                // TODO should I do this?
                this.componentDidMount();
            })
            .catch(error => {
                this.setState({
                    error: true
                });
            });
    }

    onUnredeem(event) {
        event.preventDefault();

        voucher.unredeem(this.state.id)
            .then(() => {
                // TODO should I do this?
                this.componentDidMount();
            })
            .catch(error => {
                this.setState({
                    error: true
                });
            });
    }

    render() {
        const voucher = this.state.data;

        if (!voucher) {
            return (
                <section className="section"></section>
            );
        }

        return (
            <section className="section">
                <div className="container">
                    <div className="columns is-mobile">
                        <div className="column is-two-fifths">
                            <h1 className="title">Voucher</h1>
                        </div>
                        <div className="column buttons has-text-right">
                            <button className={ "button is-danger" + (this.state.delete ? "" : " is-light") }  onClick={this.onDelete}>
                                <span className="icon">
                                    <FaTimes />
                                </span>
                                <span>{ this.state.delete ? "Are you sure?" : "Delete" }</span>
                            </button>
                            <button className="button is-link" onClick={() => this.props.history.push(`/voucher/${voucher.id}/edit`)}>
                                <span className="icon">
                                    <FaPencilAlt />
                                </span>
                                <span>Edit</span>
                            </button>
                        </div>
                    </div>
                    <div className="content">
                        <span className="is-size-4">Activity</span>
                        { display(voucher.meta.activityTitle) }

                        <span className="is-size-4">Start Date</span>
                        <p>{voucher.startDate && format(parseISO(voucher.startDate), 'yyyy-MM-dd')}</p>

                        <span className="is-size-4">Expiration Date</span>
                        <p>{voucher.meta.expirationDate && format(parseISO(voucher.meta.expirationDate), 'yyyy-MM-dd')}</p>

                        <span className="is-size-4">Client Name</span>
                        { display(voucher.clientName) }

                        <span className="is-size-4">Client Phone</span>
                        { display(voucher.clientPhone) }

                        <span className="is-size-4">Client Email</span>
                        { display(voucher.clientEmail) }

                        <span className="is-size-4">Client Voucher</span>
                        <p style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <code>{voucher.voucher}</code>
                            <button className="button is-warning is-light is-small" onClick={this.onReset} style={{ marginLeft: '0.75em' }}>
                                <span className="icon">
                                    <FaSync />
                                </span>
                                <span>Reset</span>
                            </button>
                        </p>

                        <span className="is-size-4">Redeem Date</span>
                        {voucher.redeemDate &&
                            <p style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                {voucher.redeemDate && format(parseISO(voucher.redeemDate), 'yyyy-MM-dd HH:mm:ss xxx')}
                                <button className="button is-warning is-light is-small" onClick={this.onUnredeem} style={{ marginLeft: '0.75em' }}>
                                    <span className="icon">
                                        <FaUndo />
                                    </span>
                                    <span>Unredeem</span>
                                </button>
                            </p>
                        }
                        {!voucher.redeemDate && empty("Not redeemed.")}

                        <span className="is-size-4">Activity Log</span>
                        <ActivityLog data={voucher} />
                    </div>
                </div>
            </section>
        );
    }
}

export default VoucherDetails;
