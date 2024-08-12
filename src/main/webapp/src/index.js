import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from '@sentry/browser';
import App from "./App.js";

Sentry.init({
    dsn: "https://d4892c0862cb4f4caa3b7c46844ccd16@sentry.io/1846391"
});

ReactDOM.render(<App />, document.getElementById("root"));
