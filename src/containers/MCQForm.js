import React, {Component} from "react";
import {connect} from "react-redux";
import {addNewExerciseQuestion} from "../store/actions/new_exercise";
import {addNewExercise} from "../store/actions/exercises";
import {withRouter} from "react-router-dom"
import "../css/MCQForm.css"

class MCQForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            noOfQuestions: 0,
            currentQuestionNo: -1,
            questions: [],
            currentQuestion: {
                id: 1,
                question: "",
                answers: ['', ''],
            }
        }
    }

    handleChangeAns = e => {
        const index = Number(e.target.name.split('-')[1]);
        const ans = this.state.currentQuestion.answers.map((ans, i) => (
            i === index ? e.target.value : ans
        ));
        this.setState({...this.state, currentQuestion: {...this.state.currentQuestion, answers: ans}})
    };

    handleRemoveAns = e => {
        const {currentQuestion} = this.state;
        const {answers} = currentQuestion;
        if (answers.length > 2) {
            answers.pop();
            this.setState({currentQuestion: {...currentQuestion, answers: answers}})
        }
    };

    handleNewAns = e => {
        const {currentQuestion} = this.state;
        this.setState({currentQuestion: {...currentQuestion, answers: [...this.state.currentQuestion.answers, '']}})
    };

    handleNewEvent = event => {
        event.preventDefault();
        this.saveCurrentForm();
    };

    saveCurrentForm = () => {
        const {question, answers} = this.state.currentQuestion;
        let correctAns = answers[0];
        let id = this.state.noOfQuestions + 1;

        let newQues = {
            id: id,
            answers: answers,
            question: question,
            correctAns: correctAns
        };

        this.setState({
            ...this.state,
            questions: [
                ...this.state.questions,
                newQues
            ],
            noOfQuestions: id,
            currentQuestionNo: id + 1,
            currentQuestion: {
                id: -1,
                question: "",
                answers: ['', ''],
            }
        });
    };

    submitExercise = () => {
        let exercise = {
            title: this.state.title,
            id: this.props.counter + 1,
            type: "mcq",
            questions: this.state.questions,
            scores: []
        };

        this.props.addNewExercise(exercise);
        this.props.history.push('/')

    };

    previousQues = () => {

    };

    render() {
        const {currentQuestion} = this.state;
        let inputs = currentQuestion.answers.map((ans, i) => {
            let placeholder = 'Wrong Option';
            if (i === 0) placeholder = 'Correct Option';
            return (
                <div className="row" key={`answers-${i}`}>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label htmlFor={`answer-${i}`}>
                                {i + 1}
                            </label>
                            <input
                                className="answers form-control"
                                name={`answer-${i}`}
                                type="text"
                                value={ans}
                                placeholder={placeholder}
                                onChange={this.handleChangeAns}/>
                        </div>
                    </div>
                </div>
            )
        });
        return (
            <div className="container-fluid">
                <div className="row align-items-center justify-content-center">
                    <div className="col-sm-10">
                        <div className="col-md-12">
                            <form onSubmit={this.handleNewEvent}>
                                <div className="row">
                                    <div className="form-group">
                                        <label htmlFor="title">Title Of Exercise:</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            id="title"
                                            value={this.state.title}
                                            onChange={e => this.setState({
                                                ...this.state,
                                                title: e.target.value
                                            })}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="form-group">
                                        <label htmlFor="question">Question:</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            id="question"
                                            value={this.state.currentQuestion.question}
                                            onChange={e => this.setState({
                                                ...this.state,
                                                currentQuestion: {
                                                    ...this.state.currentQuestion,
                                                    question: e.target.value
                                                }
                                            })}
                                        />
                                    </div>
                                </div>
                                {inputs}
                                <div className="row">
                                    <div className="form-group">
                                        <button
                                            type="button"
                                            onClick={this.handleNewAns}
                                            className="btn btn-dark">
                                            +
                                        </button>
                                        <button
                                            type="button"
                                            onClick={this.handleRemoveAns}
                                            className="btn btn-dark">
                                            -
                                        </button>
                                    </div>
                                </div>
                                <div className="row justify-content-between">
                                    <button
                                        className={"btn btn-info" + (this.state.noOfQuestions >= 1 ? '' : 'disabled')}
                                        onClick={this.previousQues}
                                    >
                                        Previous Question
                                    </button>
                                    <div className="justify-content-end">
                                        <button type="submit" className="btn btn-info submit-button">
                                            Next Question
                                        </button>
                                        <button
                                            className={"btn btn-success" + (this.state.noOfQuestions >= 2 ? '' : 'disabled')}
                                            onClick={this.submitExercise}
                                        >
                                            Finish Exercise
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function MapStateToProps(state) {
    return {
        counter: state.exercise_counter
    }
}

export default withRouter(connect(MapStateToProps, {addNewExerciseQuestion, addNewExercise})(MCQForm));