import React, { Component } from 'react';

import { FaArrowUp } from 'react-icons/fa';

class BackToTop extends Component {

    constructor(props) {
        super(props);

        this.state = {
            height: window.innerHeight,
            scroll: window.scrollY
        };

        this.onScroll = this.onScroll.bind(this);
    }

    componentDidMount() {
        window.addEventListener('scroll', this.onScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScroll);
    }

    onScroll(event) {
        this.setState({
            height: window.innerHeight,
            scroll: window.scrollY
        });
    }

    render() {
        const hide = this.state.scroll < this.state.height ? " is-hidden" : "";

        return (
            <div className="back-to-top">
                <a href="#" className={"button is-light is-rounded" + hide}>
                    <span className="icon">
                        <FaArrowUp/>
                    </span>
                </a>
            </div>
        );
    }
}

export default BackToTop;
