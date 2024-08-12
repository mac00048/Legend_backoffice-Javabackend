
import React from 'react';

export const empty = () => {
    return <p className="help has-text-grey-light">N/A</p>;
};

export const display = (value) => {
    if (value) {
        return <p>{value}</p>;
    } else {
        return empty();
    }
};

export const displayText = (value) => {
    if (value) {
        const html = [];
        const lines = value.trim().split("\n");

        let lineBreaks = 0;
        lines.reverse().forEach((line, index) => {
            if (line.trim() === "") {
                lineBreaks += 1;
            } else {
                if (index == 0) {
                    html.push(<p>{line}</p>);
                } else {
                    html.push(<p style={{ marginBottom: `${1.0 * lineBreaks}em` }}>{line}</p>);
                }
                lineBreaks = 0;
            }
        });

        return html.reverse();
    } else {
        return empty();
    }
};
