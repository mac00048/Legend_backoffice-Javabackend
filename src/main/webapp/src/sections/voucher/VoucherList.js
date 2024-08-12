import React, { Component } from 'react';
import { FaAngleRight, FaPlus, FaSearch, FaSortUp, FaSortDown, FaSort } from 'react-icons/fa';
import { format, parseISO } from 'date-fns'
import { voucher } from '../../lib/api';
import { debounce } from 'debounce';

class VoucherList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            query: "",
            orderBy: "client_name",
            order: "ASC",
            data: []
        };

        this.onQueryChange = this.onQueryChange.bind(this);
        this.debouncedSearch = debounce(this.search.bind(this), 500);
    }

    componentDidMount() {
        this.search();
    }

    onQueryChange(event) {
        this.setState({
            query: event.target.value
        }, this.debouncedSearch);
    }

    search() {
        voucher.list(this.state.query, this.state.orderBy, this.state.order)
            .then(json => {
                this.setState({
                    data: json
                });
            })
            .catch(error => {
                this.setState({
                    data: []
                });
            });
    }

    onColumnClick(column) {
        this.setState(prevState => {
            return {
                orderBy: column,
                order: prevState.orderBy === column ? (prevState.order === "ASC" ? "DESC" : "ASC") : "ASC"
            };
        }, this.search);
    }

    onVoucherClick(id) {
        this.props.history.push(`/voucher/${id}`);
    }

    render() {
        return (
            <section className="section">
                <div className="container">
                    <div className="columns is-vcentered is-mobile">
                        <div className="column">
                            <h1 className="title">Vouchers</h1>
                        </div>
                        <div className="column has-text-right">
                            <div className="control has-icons-left is-inline-flex is-hidden-mobile" style={{ width: '250px', marginRight: '18px' }}>
                                <input className="input is-rounded" type="text" placeholder="Search" value={this.state.query} onChange={this.onQueryChange} />
                                <span className="icon is-small is-left">
                                    <FaSearch/>
                                </span>
                            </div>
                            <button className="button is-link" onClick={() => this.props.history.push("/voucher/add")}>
                                <span className="icon">
                                    <FaPlus/>
                                </span>
                                <span>Add Voucher</span>
                            </button>
                        </div>
                    </div>
                    <div className="content">
                        <table className="table is-striped is-hoverable is-fullwidth">
                            <thead>
                                <tr>
                                    <th className="is-nowrap is-unselectable" style={{ cursor: 'pointer' }} onClick={() => this.onColumnClick('client_name')}>
                                        Client Name
                                        {this.state.orderBy === 'client_name' &&
                                            <span className="" style={{ verticalAlign: 'middle', color: '#AAA', marginLeft: '3px' }}>
                                                { this.state.order === "ASC" ? <FaSortUp /> : <FaSortDown /> }
                                            </span>
                                        }
                                        {this.state.orderBy !== 'client_name' &&
                                            <span className="" style={{ verticalAlign: 'middle', color: '#EEE', marginLeft: '3px' }}>
                                                <FaSort />
                                            </span>
                                        }
                                    </th>
                                    <th className="is-nowrap is-unselectable is-hidden-mobile">
                                        Activity
                                    </th>
                                    <th className="is-nowrap is-unselectable is-hidden-mobile" style={{ cursor: 'pointer' }} onClick={() => this.onColumnClick('start_date')}>
                                        Start Date
                                        {this.state.orderBy === 'start_date' &&
                                            <span className="" style={{ verticalAlign: 'middle', color: '#AAA', marginLeft: '3px' }}>
                                                { this.state.order === "ASC" ? <FaSortUp /> : <FaSortDown /> }
                                            </span>
                                        }
                                        {this.state.orderBy !== 'start_date' &&
                                            <span className="" style={{ verticalAlign: 'middle', color: '#EEE', marginLeft: '3px' }}>
                                                <FaSort />
                                            </span>
                                        }
                                    </th>
                                    <th className="is-nowrap is-unselectable is-hidden-mobile">
                                        Expiration Date
                                    </th>
                                    <th className="is-nowrap is-unselectable" style={{ cursor: 'pointer' }} onClick={() => this.onColumnClick('voucher')}>
                                        Voucher
                                        {this.state.orderBy === 'voucher' &&
                                            <span className="" style={{ verticalAlign: 'middle', color: '#AAA', marginLeft: '3px' }}>
                                                { this.state.order === "ASC" ? <FaSortUp /> : <FaSortDown /> }
                                            </span>
                                        }
                                        {this.state.orderBy !== 'voucher' &&
                                            <span className="" style={{ verticalAlign: 'middle', color: '#EEE', marginLeft: '3px' }}>
                                                <FaSort />
                                            </span>
                                        }
                                    </th>
                                    <th className="is-nowrap"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.data.map((item) =>
                                    <tr key={item.id} onClick={() => this.onVoucherClick(item.id)}>
                                        <td className="is-nowrap">{item.clientName}</td>
                                        <td className="is-nowrap is-hidden-mobile">{item.meta.activityTitle}</td>
                                        <td className="is-nowrap is-hidden-mobile">{item.startDate && format(parseISO(item.startDate), 'yyyy-MM-dd')}</td>
                                        <td className="is-nowrap is-hidden-mobile">{item.meta.expirationDate && format(parseISO(item.meta.expirationDate), 'yyyy-MM-dd')}</td>
                                        <td className="is-nowrap">{item.voucher}</td>
                                        <td className="is-fit is-nowrap has-text-right">
                                            <a className="has-text-grey">
                                                <span className="icon">
                                                    <FaAngleRight/>
                                                </span>
                                            </a>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        );
    }
}

export default VoucherList;
