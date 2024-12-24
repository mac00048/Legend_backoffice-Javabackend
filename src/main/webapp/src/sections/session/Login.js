import React, { Component } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { session } from '../../lib/api';

class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            form: {
                email: "",
                password: ""
            },
            error: false
        };

        // status can have the following states:
        //  input   - normal state
        //  sending - when request is happening
        //  success - when request succeeded
        //  error   - when request failed

        this.onFormChange = this.onFormChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
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

    onFormSu
    bmit(event) {
        event.preventDefault();

        session.login(this.state.form)
            .then(user => {
                this.props.onLogin(user);
                this.props.history.push("/");
            })
            .catch(error => {
                this.setState({
                    error: true
                });
            });
    }

    render() {
        const errorClass = this.state.error ? "is-danger" : "";

        return (
            <section className="section">
                <div className="container">
                    <div className="column is-4 is-offset-4" style={{ textAlign: "center" }}>
                        <img src={require('../../assets/logo-motto.png').default} style={{ width: '250px', marginBottom: '50px' }} />

                        <form name="contact" method="POST" onSubmit={this.onFormSubmit}>
                            <div className="field">
                                <p className="control has-icons-left has-icons-right">
                                    <input className={"input " + errorClass} name="email" type="email" placeholder="Email" value={this.state.form.email} onChange={this.onFormChange}/>
                                    <span className="icon is-small is-left">
                                        <FaEnvelope />
                                    </span>
                                </p>
                            </div>
                            <div className="field">
                                <p className="control has-icons-left">
                                    <input className={"input " + errorClass} name="password" type="password" placeholder="Password" value={this.state.form.password} onChange={this.onFormChange}/>
                                    <span className="icon is-small is-left">
                                        <FaLock />
                                    </span>
                                </p>
                            </div>
                            <div className="field">
                                <p className="control">
                                    <button className="button is-link">Sign in</button>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        );
    }
}

export default Login;
