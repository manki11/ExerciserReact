import React, {Component} from "react"
import {Bar, Line, Pie} from 'react-chartjs-2';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {injectIntl} from "react-intl";


class PresenceScores extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log("presence score mounted");
        
        if (this.props.location) {
            const {exercise}= this.props.location.state;
            console.log(exercise.shared_results);
        }
    }

    render() {
        return (
            <div>
                Presence Scores
            </div>
        )
    }
}

function MapStateToProps(state) {
    return {}
}

export default injectIntl(withRouter(
    connect(MapStateToProps, {})(PresenceScores)));