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
            currentQuestionNo: 1,
            questions: [],
            isFormValid: false,
            errors: {
                question: '',
                answers: '',
                title: ''
            },
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
    };

    saveCurrentForm = () => {
        console.log("save question");

        this.checkFormValidation();

        if (this.state.isFormValid) {
            const {currentQuestionNo, noOfQuestions} = this.state;
            const {question, answers} = this.state.currentQuestion;
            let correctAns = answers[0];
            let id = currentQuestionNo;

            let Ques = {
                id: id,
                answers: answers,
                question: question,
                correctAns: correctAns
            };

            if (currentQuestionNo > noOfQuestions) {
                this.setState({
                    ...this.state,
                    questions: [
                        ...this.state.questions,
                        Ques
                    ],
                    noOfQuestions: id,
                    currentQuestionNo: id + 1,
                    currentQuestion: {
                        id: id + 1,
                        question: "",
                        answers: ['', ''],
                    }
                });
            }
            else {
                const {questions} = this.state;
                let index = currentQuestionNo;
                const updatedQuestions = questions.map((ques, i) => (
                    ques.id === index ? Ques : ques
                ));
                if (currentQuestionNo === noOfQuestions) {
                    this.setState({
                        ...this.state,
                        questions: updatedQuestions,
                        currentQuestionNo: currentQuestionNo + 1,
                        currentQuestion: {
                            id: currentQuestionNo + 1,
                            question: '',
                            answers: ['', ''],
                        }
                    });
                } else {
                    const {question, answers} = this.state.questions[index];
                    this.setState({
                        ...this.state,
                        questions: updatedQuestions,
                        currentQuestionNo: index + 1,
                        currentQuestion: {
                            id: index + 1,
                            question: question,
                            answers: answers,
                        }
                    });
                }
            }
        }
    };

    checkFormValidation = () => {
        const {currentQuestion, title} = this.state;
        const {question, answers} = currentQuestion;
        let errors = {};
        let isFormValid = true;

        if (question === '') {
            errors['question'] = 'Question field cant be empty';
            isFormValid = false;
        }

        if (title === '') {
            errors['title'] = "Title can't be empty";
            isFormValid = false;
        }

        answers.map((ans, i) => {
            if (ans === '') {
                errors['answers'] = "Answer fields can't be empty";
                isFormValid = false;
            }
        });

        this.setState({
            ...this.state,
            errors: errors,
            isFormValid: isFormValid
        })


    };

    submitExercise = () => {
        console.log("submit exercise");

        let exercise = {
            title: this.state.title,
            id: this.props.counter + 1,
            type: "MCQ",
            questions: this.state.questions,
            scores: []
        };

        this.props.addNewExercise(exercise);
        this.props.history.push('/')
    };

    previousQues = () => {
        console.log("previous question");

        const {currentQuestionNo} = this.state;
        let previousQuestionNo = currentQuestionNo - 1;
        console.log("cn" + currentQuestionNo);
        console.log("pn" + previousQuestionNo);

        let previousQuestion = this.state.questions[previousQuestionNo - 1];
        const {id, question, answers} = previousQuestion;
        let currentQuestion = {
            id: id,
            question: question,
            answers: answers
        };

        this.setState({
            ...this.state,
            currentQuestionNo: id,
            currentQuestion: currentQuestion
        })
    };

    render() {
        const {currentQuestion} = this.state;
        const {id} = currentQuestion;
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
                                required
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
                                            required
                                            value={this.state.title}
                                            onChange={e => this.setState({
                                                ...this.state,
                                                title: e.target.value
                                            })}
                                        />
                                        <span style={{color: "red"}}>{this.state.errors["title"]}</span>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="form-group">
                                        <label htmlFor="question">{id}. Question:</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            id="question"
                                            required
                                            value={this.state.currentQuestion.question}
                                            onChange={e => this.setState({
                                                ...this.state,
                                                currentQuestion: {
                                                    ...this.state.currentQuestion,
                                                    question: e.target.value
                                                }
                                            })}
                                        />
                                        <span style={{color: "red"}}>{this.state.errors["question"]}</span>
                                    </div>
                                </div>
                                {inputs}
                                <div>
                                    <span style={{color: "red"}}>{this.state.errors["answers"]}</span>
                                </div>
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
                                <div className="form-group row justify-content-between">
                                    <button
                                        className={"btn btn-info" + (this.state.noOfQuestions >= 1 ? '' : 'disabled')}
                                        onClick={this.previousQues}
                                    >
                                        Previous Question
                                    </button>
                                    <div className="justify-content-end">
                                        <button onClick={this.saveCurrentForm} className="btn btn-info submit-button">
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