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
            noOfQuestions: 0,
            currentQuestionNo:-1,
            questions: [],
            currentQuestion: {
                id: -1,
                question: "",
                a: "",
                b: "",
                c: "",
                d: "",
                correctAns: ""
            }
        }
    }

    handleNewEvent = event => {
        event.preventDefault();
        this.saveCurrentForm();
    };

    saveCurrentForm= ()=> {
        let a= this.state.currentQuestion.a;
        let b= this.state.currentQuestion.b;
        let c= this.state.currentQuestion.c;
        let d= this.state.currentQuestion.d;

        let question= this.state.currentQuestion.question;
        let answers=[a,b,c,d];
        let id= this.state.noOfQuestions+1;
        let correctAns= a;

        let newQues={
            id:id,
            answers:answers,
            question:question,
            correctAns:correctAns
        };

        this.setState({
            ...this.state,
            questions:[
                ...this.state.questions,
                newQues
            ],
            noOfQuestions: id,
            currentQuestionNo: id+1,
            currentQuestion: {
                id: -1,
                question: "",
                a: "",
                b: "",
                c: "",
                d: "",
                correctAns: ""
            }
        });
    };

    submitExercise= ()=> {
        let exercise={
            id: this.props.counter+1,
            type: "mcq",
            questions: this.state.questions,
            scores:[]
        };

        this.props.addNewExercise(exercise);
        this.props.history.push('/')

    };

    render() {
        return (
            <div className="container-fluid">
                <div className="row align-items-center justify-content-center">
                    <div className="col-sm-10">
                        <div className="col-md-12">
                            <form onSubmit={this.handleNewEvent}>
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
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="correctanswer">Correct Answer:</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                id="correctanswer"
                                                value={this.state.currentQuestion.a}
                                                onChange={e => this.setState({
                                                    currentQuestion: {
                                                        ...this.state.currentQuestion,
                                                        a: e.target.value
                                                    }
                                                })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="wronganswer">Other Options:</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                id="wronganswer"
                                                value={this.state.currentQuestion.b}
                                                onChange={e => this.setState({
                                                    currentQuestion: {
                                                        ...this.state.currentQuestion,
                                                        b: e.target.value
                                                    }
                                                })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <input
                                                className="form-control"
                                                type="text"
                                                value={this.state.currentQuestion.c}
                                                onChange={e => this.setState({
                                                    currentQuestion: {
                                                        ...this.state.currentQuestion,
                                                        c: e.target.value
                                                    }
                                                })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <input
                                                className="form-control"
                                                type="text"
                                                value={this.state.currentQuestion.d}
                                                onChange={e => this.setState({
                                                    currentQuestion: {
                                                        ...this.state.currentQuestion,
                                                        d: e.target.value
                                                    }
                                                })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-between">
                                    <button className={"btn btn-info"+(this.state.noOfQuestions>=1 ? '' : 'disabled')}>
                                        Previous Question
                                    </button>
                                    <div className="justify-content-end">
                                    <button type="submit" className="btn btn-info submit-button">
                                        Next Question
                                    </button>
                                    <button
                                        className={"btn btn-success"+(this.state.noOfQuestions>=2 ? '' : 'disabled')}
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