import React, { Component } from 'react';
import RichTextEditor from 'react-rte';

class RichEditor extends Component {

    constructor(props) {
        super(props);

        // TODO remove when all activities are formatted in HTML
        var html;
        if (this.props.value && !this.props.value.startsWith('<')) {
            html = "";
            this.props.value.trim().split("\n").forEach((line, index) => {
                html += `<p>${line.trim()}</p>`;
            });
        } else {
            html = this.props.value;
        }

        this.state = {
            editor: RichTextEditor.createValueFromString(html, "html")
        };

        this.onEditorChange = this.onEditorChange.bind(this);
        this.update = this.update.bind(this);
    }

    componentDidMount() {
        this.update();
    }

    update() {
        const html = this.state.editor.toString("html");

        if (!html || html === "" || html ==="<p><br></p>") {
            this.props.onChange("");
        } else {
            this.props.onChange(html);
        }
    }

    onEditorChange(state) {
        this.setState({
            editor: state
        }, this.update);
    }

    render() {
        const toolbarConfig = {
            display: [ 'HISTORY_BUTTONS', 'BLOCK_TYPE_DROPDOWN', 'INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS'],
            INLINE_STYLE_BUTTONS: [
                {label: 'Bold', style: 'BOLD'},
                {label: 'Italic', style: 'ITALIC'},
                {label: 'Strikethrough', style: 'STRIKETHROUGH'},
                {label: 'Underline', style: 'UNDERLINE'}
            ],
            BLOCK_TYPE_DROPDOWN: [
                {label: 'H1', style: 'header-one'},
                {label: 'H2', style: 'header-two'},
                {label: 'H3', style: 'header-three'},
                {label: 'Text', style: 'unstyled'}
            ],
            BLOCK_TYPE_BUTTONS: [
                {label: 'UL', style: 'unordered-list-item'},
                {label: 'OL', style: 'ordered-list-item'}
            ]
        };

        return (
            <div style={{ minHeight: '20em' }}>
                <RichTextEditor
                    value={this.state.editor}
                    onChange={this.onEditorChange}
                    toolbarConfig={toolbarConfig}
                    editorStyle={{ height: '20em' }}
                />
            </div>
        );
    }
}

export default RichEditor;
