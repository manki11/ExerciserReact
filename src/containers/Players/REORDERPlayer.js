import React, {Component} from 'react'
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {addScoreTime} from '../../store/actions/exercises';
import {SUBMIT_QUESTION, FINISH_EXERCISE} from "../translation";
import {FormattedMessage} from 'react-intl';
import DragList from "../../components/DragList";

class REORDERPlayer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            id: -1,
            title: '',
            question: '',
            list: [],
            userAns: [],
            checkAns: [],
            submitted: false,
            scores: [],
            score: 0,
            times: [],
            currentTime: 0,
            intervalID: -1
        }
    }

    componentDidMount() {
        if (this.props.location.state) {
            let intervalId = setInterval(this.timer, 1000);
            const {id, title, question, scores, times, list} = this.props.location.state.exercise;

            let userAns = this.shuffleArray(list.slice());

            let checkAns = list.map(() => false);

            console.log(list);


            this.setState({
                ...this.state,
                id: id,
                title: title,
                question: question,
                scores: scores,
                times: times,
                list: list,
                userAns: userAns,
                intervalId: intervalId,
                checkAns: checkAns
            })
        }
    }

    timer = () => {
        this.setState({currentTime: this.state.currentTime + 1});
    };

    componentWillUnmount() {
        clearInterval(this.state.intervalID);
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // eslint-disable-line no-param-reassign
        }
    }


    render() {

        return (
            <div className="container">
                <div>
                    <DragList list={this.state.list}/>
                </div>
            </div>
        )
    }
}

function MapStateToProps(state) {
    return {}
}

export default withRouter(
    connect(MapStateToProps, {addScoreTime})(REORDERPlayer));