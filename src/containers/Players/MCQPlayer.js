import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import "../../css/MCQPlayer.css"


class MCQPlayer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            title: '',
            questions: [],
            noOfQuestions: 1,
            currentQuestionNo: 1,
            submitted:false,
            selected:false,
            scores: [],
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
            const {id, title, questions, scores} = this.props.location.state.exercise;
            const currentQuestion = questions[0];
            console.log(this.props.location.state.exercise);

            // this.shuffleArray(currentQuestion.answers);

            this.setState({
                ...this.state,
                title: title,
                questions: questions,
                noOfQuestions: questions.length,
                scores: scores,
                currentQuestion: {
                    id: currentQuestion.id,
                    question: currentQuestion.question,
                    answers: currentQuestion.answers,
                    correctAns: currentQuestion.correctAns
                }
            })
        }
    }

    static shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // eslint-disable-line no-param-reassign
        }
    }

    render() {
        const {currentQuestion} = this.state;
        const {id} = currentQuestion;
        let choices = currentQuestion.answers.map((ans, i) => {
            let placeholder = 'Wrong Option';
            let btn = 'btn-secondary';
            if(this.state.submitted) {
                btn = ans === currentQuestion.correctAns ? "btn-success" : "btn-danger";
            }
            return (
                <div className="choices-row" key={`answers-${i}`}>
                    <div className="col-md-6 choices-div">
                            <div
                                className={"btn choices-button " + btn}
                                id={`answer-${i}`}
                            >{ans}</div>
                    </div>
                </div>
            )
        });
        return (
            <div className="container-fluid">
                <div className="row align-items-center justify-content-center">
                    <div className="col-sm-10">
                        <div className="col-md-12">
                            <div className="row">
                                <div className="form-group">
                                    <div className="form-control" id="title">
                                        {this.state.title}
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group">
                                    <div className="form-control" id="question">
                                        {id}. {this.state.currentQuestion.question}
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                            {choices}
                            </div>
                            <div className="form-group row justify-content-between">
                                <div className="justify-content-end">
                                    <button
                                        onClick={this.saveCurrentForm}
                                        className={"btn btn-info"}
                                        disabled={!this.state.selected}
                                    >
                                        Submit Question
                                    </button>
                                    <button
                                        onClick={this.submitExercise}
                                        className={"btn btn-success"}
                                        disabled={!this.state.submitted}
                                    >
                                        Next Question
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
    connect(MapStateToProps)(MCQPlayer));