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
                question: false,
                answers: false,
                title: false
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
        let error = false;
        if (e.target.value === '') {
            error = true;
        }
        this.setState({
            ...this.state,
            currentQuestion: {...this.state.currentQuestion, answers: ans},
            errors: {
                ...this.state.errors,
                answers: error
            }
        }, () => {
            this.checkFormValidation();
        });
    };

    handleChangeTitle = e => {
        let error=false;
        if(e.target.value===''){
            error=true;
        }
        this.setState({
            ...this.state,
            title: e.target.value,
            errors:{
                ...this.state.errors,
                title: error
            }
        }, () => {
            this.checkFormValidation();
        });
    };

    handleChangeQues = e => {
        let error=false;
        if(e.target.value===''){
            error=true;
        }
        this.setState({
            ...this.state,
            errors:{
                ...this.state.errors,
                question: error
            },
            currentQuestion: {
                ...this.state.currentQuestion,
                question: e.target.value
            }
        }, () => {
            this.checkFormValidation();
        });
    };

    handleRemoveAns = e => {
        const {currentQuestion} = this.state;
        const {answers} = currentQuestion;
        if (answers.length > 2) {
            answers.pop();
            this.setState(
                {currentQuestion: {...currentQuestion, answers: answers}},
                () => {
                    this.checkFormValidation();
                }
            )
        }
    };

    handleNewAns = e => {
        const {currentQuestion} = this.state;
        this.setState(
            {currentQuestion: {...currentQuestion, answers: [...this.state.currentQuestion.answers, '']}},
            () => {
                this.checkFormValidation();
            }
        )
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
        let isFormValid = true;

        if (question === '') {
            isFormValid = false;
        }

        if (title === '') {
            isFormValid = false;
        }

        answers.map((ans, i) => {
            if (ans === '') {
                isFormValid = false;
            }
        });

        this.setState({
            ...this.state,
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
        const {currentQuestion, errors} = this.state;
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
        let title_error = '';
        let question_error = '';
        let answer_error = '';

        if (errors['title']) {
            title_error = <span style={{color: "red"}}>Title field can't be empty</span>;
        }
        if (errors['question']) {
            question_error = <span style={{color: "red"}}>Question field can't be empty</span>;
        }
        if (errors['answers']) {
            answer_error = <span style={{color: "red"}}>Answers field can't be empty</span>;
        }

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
                                            onChange={this.handleChangeTitle}
                                        />
                                        {title_error}
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
                                            onChange={this.handleChangeQues}
                                        />
                                        {question_error}
                                    </div>
                                </div>
                                {inputs}
                                <div>
                                    {answer_error}
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
                                        onClick={this.previousQues}
                                        className={"btn btn-info"}
                                        disabled={!this.state.noOfQuestions >= 1}
                                    >
                                        Previous Question
                                    </button>
                                    <div className="justify-content-end">
                                        <button
                                            onClick={this.saveCurrentForm}
                                            className={"btn btn-info"}
                                            disabled={!this.state.isFormValid}
                                        >
                                            Next Question
                                        </button>
                                        <button
                                            onClick={this.submitExercise}
                                            className={"btn btn-success"}
                                            disabled={!this.state.noOfQuestions >= 1}
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