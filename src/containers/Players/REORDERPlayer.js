import React, {Component} from 'react'
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {addScoreTime} from '../../store/actions/exercises';
import {SUBMIT_QUESTION, FINISH_EXERCISE} from "../translation";
import {FormattedMessage} from 'react-intl';
import DragList from "../../components/DragList";
import "../../css/REORDERPlayer.css"

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
            intervalID: -1,
        }
    }

    componentDidMount() {
        if (this.props.location.state) {
            let intervalId = setInterval(this.timer, 1000);
            const {id, title, question, scores, times, list} = this.props.location.state.exercise;

            let userAns = this.shuffleArray(list.slice());

            let checkAns = list.map(() => false);

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
        return array;
    }

    onListChange = (list) => {
        list = list.map((li, i) => {
            return li.content
        });
        this.setState({userAns: list});
        // console.log(list);

    };

    submitExercise = () => {
        const {userAns, list} = this.state;
        let checkAns = [];
        let score = 0;
        for (let i = 0; i < list.length; i++) {
            if (list[i].toLowerCase() === userAns[i].toLowerCase()) {
                checkAns.push(true);
                score++;
            } else {
                checkAns.push(false)
            }
        }

        this.setState({
            ...this.state,
            submitted: true,
            checkAns: checkAns,
            score: score
        })
    };

    finishExercise = () => {
        const {scores, score, id, currentTime, times, list} = this.state;
        let exercise = this.props.location.state.exercise;
        let noOfQuestions = list.length;
        scores.push(score);
        times.push(currentTime);

        this.props.addScoreTime(id, score, currentTime);

        this.props.history.push('/scores', {
            scores: scores,
            userScore: score,
            times: times,
            userTime: currentTime,
            noOfQuestions: noOfQuestions,
            exercise: exercise,
            type: "REORDER"
        });
    };

    render() {

        const {checkAns, userAns} = this.state;

        let buttonText = <FormattedMessage id={SUBMIT_QUESTION}/>;
        if (this.state.submitted) buttonText = <FormattedMessage id={FINISH_EXERCISE}/>;

        let list = (<DragList list={this.state.userAns} onChange={this.onListChange}/>);
        if (this.state.submitted) {
            list = checkAns.map((bool, i) => {
                let className = 'btn-danger';
                if (bool) className = 'btn-success';

                return (
                    <div className={"list-item " + className} key={`list-item${i}`}>
                        {userAns[i]}
                    </div>
                )
            })
        }

        return (
            <div className="container">
                <div>
                    <div className="container-fluid">
                        <div className="row align-items-center justify-content-center">
                            <div className="col-sm-10">
                                <div className="jumbotron">
                                    <p className="lead">{this.state.title}</p>
                                    <hr className="my-4"/>
                                    <p>{this.state.question}</p>
                                    <div>
                                        {list}
                                    </div>
                                </div>
                                <div className="d-flex flex-row-reverse">
                                    <div className="justify-content-end">
                                        <button
                                            onClick={() => {
                                                if (this.state.submitted) this.finishExercise();
                                                else this.submitExercise();
                                            }}
                                            className={"btn next-button"}
                                        >
                                            {buttonText}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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