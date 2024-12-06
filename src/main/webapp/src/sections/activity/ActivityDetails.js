import React, { Component } from "react";
import { FaPencilAlt, FaTimes, FaClone } from "react-icons/fa";
import ImageList from "../common/ImageList";
import PDFList from "../common/PDFList"; // Import the PDFList component
import ActivityDayList from "./day/ActivityDayList";
import { activity, activityDay } from "../../lib/api";
import { display } from "../../lib/helpers";
import ActivityLog from "../common/ActivityLog";
import RichContent from "../common/RichContent";

class ActivityDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.id,
      data: null,
      delete: false,
    };

    this.onDelete = this.onDelete.bind(this);
    this.onClone = this.onClone.bind(this);
  }

  componentDidMount() {
    activity
      .get(this.state.id)
      .then((json) =>
        this.setState({
          data: json,
        })
      )
      .catch((error) =>
        this.setState({
          data: null,
        })
      );
  }

  onDelete(event) {
    event.preventDefault();

    if (!this.state.delete) {
      this.setState({
        delete: true,
      });

      return;
    }

    activity
      .remove(this.state.id)
      .then(() => {
        this.props.history.push(`/activity`);
      })
      .catch((error) => {
        this.setState({
          error: true,
        });
      });
  }

  onClone(event) {
    event.preventDefault();
    const clonedData = { ...this.state.data, id: undefined };

    activity
      .add(clonedData)
      .then((newActivity) => {
        if (newActivity && newActivity.id) {
          return activityDay.list(this.state.data.id).then((days) => {
            let chain = Promise.resolve();

            days.forEach((day) => {
              chain = chain.then(() => {
                const clonedDay = {
                  ...day,
                  id: undefined,
                  activityId: newActivity.id,
                };
                return activityDay.add(newActivity.id, clonedDay);
              });
            });

            return chain.then(() => {
              this.props.history.push(`/activity/${newActivity.id}/edit`);
            });
          });
        } else {
          this.setState({ error: true });
        }
      })
      .catch((error) => {
        this.setState({ error: true });
      });
  }

  render() {
    if (!this.state.data) {
      return <section className="section"></section>;
    }

    return (
      <section className="section">
        <div className="container">
          <div className="columns is-mobile">
            <div className="column is-two-fifths">
              <h1 className="title">Activity</h1>
            </div>
            <div className="column buttons has-text-right">
              <button
                className={
                  "button is-danger" + (this.state.delete ? "" : " is-light")
                }
                onClick={this.onDelete}
              >
                <span className="icon">
                  <FaTimes />
                </span>
                <span>{this.state.delete ? "Are you sure?" : "Delete"}</span>
              </button>
              <button
                className="button is-link"
                onClick={() =>
                  this.props.history.push(
                    `/activity/${this.state.data.id}/edit`
                  )
                }
              >
                <span className="icon">
                  <FaPencilAlt />
                </span>
                <span>Edit</span>
              </button>
              <button className="button is-info" onClick={this.onClone}>
                <span className="icon">
                  <FaClone />
                </span>
                <span>Clone</span>
              </button>
            </div>
          </div>
          <div className="content">
            <span className="is-size-4">Title</span>
            {display(this.state.data.title)}
            <span className="is-size-4">Subtitle</span>
            {display(this.state.data.subtitle)}
            <span className="is-size-4">Description</span>
            <RichContent value={this.state.data.description} />
            <span className="is-size-4">Images</span>
            <ImageList images={this.state.data.images} />
            <span className="is-size-4">Documents</span>
            <PDFList documents={this.state.data.documents} />{" "}
            <ActivityDayList activityId={this.state.data.id} />
            <span className="is-size-4">Activity Log</span>
            <ActivityLog data={this.state.data} />
          </div>
        </div>
      </section>
    );
  }
}

export default ActivityDetails;
