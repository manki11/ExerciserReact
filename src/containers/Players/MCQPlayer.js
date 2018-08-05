import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {addScoreTime} from '../../store/actions/exercises';
import "../../css/MCQPlayer.css"
import {SUBMIT_QUESTION, NEXT_QUESTION, FINISH_EXERCISE} from "../translation";
import {FormattedMessage} from 'react-intl';


class MCQPlayer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: -1,
            title: '',
            questions: [],
            noOfQuestions: 1,
            currentQuestionNo: 1,
            submitted: false,
            selected: false,
            selectedAns: '',
            scores: [],
            times: [],
            currentTime: 0,
            intervalID: -1,
            goBackToEdit: false,
            currentScore: 0,
            finish: false,

            currentQuestion: {
                id: 1,
                question: '',
                answers: [],
                correctAns: ''
            }
        }
    }

    componentDidMount() {
        if (this.props.location.state) {
            let intervalId = setInterval(this.timer, 1000);
            const {id, title, questions, scores, times} = this.props.location.state.exercise;
            const currentQuestion = questions[0];

            let finish = false;
            if (questions.length === 1) finish = true;

            let goBackToEdit = false;
            if (this.props.location.state.edit) goBackToEdit = true;

            let answers = currentQuestion.answers;
            this.shuffleArray(answers);

            this.setState({
                ...this.state,
                id: id,
                title: title,
                questions: questions,
                noOfQuestions: questions.length,
                intervalID: intervalId,
                scores: scores,
                times: times,
                finish: finish,
                goBackToEdit: goBackToEdit,
                currentQuestion: {
                    id: currentQuestion.id,
                    question: currentQuestion.question,
                    answers: answers,
                    correctAns: currentQuestion.correctAns
                }
            })
        }
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalID);
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // eslint-disable-line no-param-reassign
        }
    }

    choiceSelected = choice => {
        if (!this.state.submitted) {
            this.setState({
                selectedAns: choice,
                selected: true
            })
        }
    };

    timer = () => {
        this.setState({currentTime: this.state.currentTime + 1});
    };

    submitQuestion = () => {
        const {currentScore, selectedAns, currentQuestion} = this.state;
        const {correctAns} = currentQuestion;
        let score = currentScore;
        if (selectedAns === correctAns) score = score + 1;
        this.setState({
            selected: false,
            submitted: true,
            currentScore: score
        })
    };

    nextQuestion = () => {
        const {currentQuestionNo, questions} = this.state;
        let nextQuestionNo = currentQuestionNo + 1;
        if (nextQuestionNo > questions.length) {
            this.exerciseFinish();
        } else {
            const nextQuestion = questions[nextQuestionNo - 1];
            let answers = nextQuestion.answers;
            this.shuffleArray(answers);
            let finish = false;
            if (nextQuestionNo === questions.length) finish = true;
            this.setState({
                ...this.state,
                currentQuestionNo: nextQuestionNo,
                submitted: false,
                selected: false,
                selectedAns: '',
                finish: finish,
                currentQuestion: {
                    id: nextQuestion.id,
                    question: nextQuestion.question,
                    answers: answers,
                    correctAns: nextQuestion.correctAns
                }
            })
        }

    };

    exerciseFinish = () => {
        const {scores, currentScore, id, currentTime, times, noOfQuestions, goBackToEdit} = this.state;
        let exercise = this.props.location.state.exercise;
        scores.push(currentScore);
        times.push(currentTime);
        this.props.addScoreTime(id, currentScore, currentTime);

        if (goBackToEdit)
            this.props.history.push('/edit/mcq', {exercise: exercise});
        else
            this.props.history.push('/scores', {
                scores: scores,
                userScore: currentScore,
                times: times,
                userTime: currentTime,
                noOfQuestions: noOfQuestions,
                exercise: exercise,
                type: "MCQ"
            });
    };

    render() {
        const {currentQuestion} = this.state;
        const {id} = currentQuestion;

        let choices = currentQuestion.answers.map((ans, i) => {
            let btn = 'btn-outline-secondary';
            if (this.state.selectedAns === ans) {
                btn = 'btn-secondary'
            }
            if (this.state.submitted) {
                if (this.state.selectedAns === this.state.currentQuestion.correctAns) {
                    if (ans === this.state.selectedAns) {
                        btn = 'btn-success';
                    }
                } else {
                    if (ans === this.state.currentQuestion.correctAns) {
                        btn = 'btn-success';
                    }
                    if (this.state.selectedAns === ans) {
                        btn = 'btn-danger';
                    }
                }
            }
            return (
                <div className="choices-row" key={`answers-${i}`}>
                    <div className="col-md-6 choices-div">
                        <button
                            className={"btn choices-button " + btn}
                            id={`answer-${i}`}
                            onClick={(e) => this.choiceSelected(ans)}
                        >{ans}</button>
                    </div>
                </div>
            )
        });

        let buttonText = <FormattedMessage id={SUBMIT_QUESTION}/>;
        if (this.state.submitted) {
            buttonText = <FormattedMessage id={NEXT_QUESTION}/>;
            if (this.state.finish) buttonText = <FormattedMessage id={FINISH_EXERCISE}/>;
        }

        return (
            <div className="container">
                <div className="row align-items-center justify-content-center">
                    <div className="col-sm-10">
                        <div className="col-md-12">
                            <div className="jumbotron">
                                <p className="lead">{this.state.title}</p>
                                <hr className="my-4"/>
                                <p>{id}. {this.state.currentQuestion.question}</p>
                            </div>
                            <div className="row">
                                {choices}
                            </div>
                            <div className="d-flex flex-row-reverse">
                                <div className="justify-content-end">
                                    <button
                                        onClick={() => {
                                            if (this.state.selected) this.submitQuestion();
                                            else if (this.state.submitted) this.nextQuestion();
                                        }}
                                        className={"btn next-button"}
                                        disabled={!this.state.selected && !this.state.submitted}
                                    >
                                        {buttonText}
                                    </button>
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
    connect(MapStateToProps, {addScoreTime})(MCQPlayer));