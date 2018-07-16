import React, {Component} from "react";
import {connect} from "react-redux";
import {incrementExerciseCounter} from "../../store/actions/increment_counter";
import {addNewExercise, editExercise} from "../../store/actions/exercises";
import {FormattedMessage} from 'react-intl';
import {withRouter} from "react-router-dom"
import "../../css/CLOZEForm.css"
import {
    FINISH_EXERCISE,
    QUESTION,
    TITLE_OF_EXERCISE,
    CLOZE,
    CLOZE_TEXT,
    BLANK_TYPE,
    WRITE_IN,
    OPTIONS
} from "../translation";

class CLOZEForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            edit: false,
            id: -1,
            title: '',
            question: '',
            clozetext: '',
            scores: [],
            times: [],
            isFormValid: false,
            answers: [''],
            writeIn: "OPTIONS",
            errors: {
                question: false,
                answers: false,
                title: false,
                cloze: false
            }
        };
    }

    componentDidMount() {
        if (this.props.location.state) {
            const {id, title, question, scores, times, clozetext, answers, writeIn} = this.props.location.state.exercise;
            this.setState({
                ...this.state,
                id: id,
                title: title,
                edit: true,
                isFormValid: true,
                question: question,
                scores: scores,
                times: times,
                clozetext: clozetext,
                answers: answers,
                writeIn: writeIn
            });
        }
    }

    handleChangeAns = e => {
        const index = Number(e.target.name.split('-')[1]);
        const ans = this.state.answers.map((ans, i) => (
            i === index ? e.target.value : ans
        ));
        let error = false;
        if (e.target.value === '') {
            error = true;
        }
        this.setState({
            ...this.state,
            answers: ans,
            errors: {
                ...this.state.errors,
                answers: error
            }
        }, () => {
            this.checkFormValidation();
        });
    };

    handleChangeTitle = e => {
        let error = false;
        if (e.target.value === '') {
            error = true;
        }
        this.setState({
            ...this.state,
            title: e.target.value,
            errors: {
                ...this.state.errors,
                title: error
            }
        }, () => {
            this.checkFormValidation();
        });
    };

    handleChangeQues = e => {
        let error = false;
        if (e.target.value === '') {
            error = true;
        }
        this.setState({
            ...this.state,
            errors: {
                ...this.state.errors,
                question: error
            },
            question: e.target.value
        }, () => {
            this.checkFormValidation();
        });
    };

    handleChangeCloze = e => {
        let error = false;
        if (e.target.value === '') {
            error = true;
        }
        this.setState({
            ...this.state,
            errors: {
                ...this.state.errors,
                cloze: error
            },
            clozetext: e.target.value
        }, () => {
            this.checkFormValidation();
        });
    };

    handleRemoveAns = () => {
        const {answers} = this.state;
        if (answers.length > 1) {
            answers.pop();
            this.setState(
                {answers: answers},
                () => {
                    this.checkFormValidation();
                }
            )
        }
    };

    handleNewAns = () => {
        const {answers} = this.state;
        this.setState(
            {answers: [...this.state.answers, '']},
            () => {
                this.checkFormValidation();
            }
        )
    };

    checkFormValidation = () => {
        const {title, question, answers, clozetext} = this.state;
        let isFormValid = true;

        if (question === '') {
            isFormValid = false;
        }

        if (title === '') {
            isFormValid = false;
        }

        if (clozetext === '') {
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

    handleNewEvent = event => {
        event.preventDefault();
    };

    submitExercise = () => {
        let id = this.state.id;
        if (this.state.id === -1) {
            id = this.props.counter;
        }

        let exercise = {
            title: this.state.title,
            id: id,
            type: "CLOZE",
            times: this.state.times,
            question: this.state.question,
            clozetext: this.state.clozetext,
            answers: this.state.answers,
            scores: this.state.scores,
            writeIn: this.state.writeIn
        };


        console.log(exercise);

        if (this.state.edit) {
            this.props.editExercise(exercise);
        } else {
            this.props.addNewExercise(exercise);
            this.props.incrementExerciseCounter();
        }
        this.props.history.push('/')
    };

    render() {
        const {errors, answers} = this.state;
        let inputs = answers.map((ans, i) => {
            return (
                <div className="row" key={`answers-${i}`}>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label htmlFor={`answer-${i}`}>
                                {i + 1}
                            </label>
                            <FormattedMessage id={CLOZE}>
                                {placeholder => <input
                                    className="answers input-ans"
                                    name={`answer-${i}`}
                                    type="text"
                                    value={ans}
                                    required
                                    placeholder={`${placeholder} ${i + 1}`}
                                    onChange={this.handleChangeAns}/>}
                            </FormattedMessage>
                        </div>
                    </div>
                </div>
            )
        });
        let title_error = '';
        let question_error = '';
        let answer_error = '';
        let cloze_error = '';

        if (errors['title']) {
            title_error = <span style={{color: "red"}}>Title field can't be empty</span>;
        }
        if (errors['question']) {
            question_error = <span style={{color: "red"}}>Question field can't be empty</span>;
        }
        if (errors['answers']) {
            answer_error = <span style={{color: "red"}}>Answers field can't be empty</span>;
        }
        if (errors['cloze']) {
            cloze_error = <span style={{color: "red"}}>Cloze field can't be empty</span>;
        }
        return (
            <div>
                <div className="container-fluid">
                    <div className="row align-items-center justify-content-center">
                        <div className="col-sm-10">
                            <div className="col-md-12">
                                <form onSubmit={this.handleNewEvent}>
                                    <div className="row">
                                        <div className="form-group">
                                            <label htmlFor="title"><FormattedMessage id={TITLE_OF_EXERCISE}/></label>
                                            <input
                                                className="input-mcq"
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
                                            <label htmlFor="question"><FormattedMessage id={QUESTION}/>:</label>
                                            <input
                                                className="input-mcq"
                                                type="text"
                                                id="question"
                                                required
                                                value={this.state.question}
                                                onChange={this.handleChangeQues}
                                            />
                                            {question_error}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="form-group">
                                            <label><FormattedMessage id={BLANK_TYPE}/>:</label>
                                            <div className="form-check">
                                                <input type="radio" name="writeIn"
                                                       value={"WRITEIN"}
                                                       checked={this.state.writeIn === "WRITEIN"}
                                                       required
                                                       onChange={(e) => {
                                                           this.setState({writeIn: e.target.value})
                                                       }}/>
                                                <label className="form-check-label">
                                                    <FormattedMessage id={WRITE_IN}/>
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input type="radio" name="writeIn"
                                                       value={"OPTIONS"}
                                                       checked={this.state.writeIn === "OPTIONS"}
                                                       required
                                                       onChange={(e) => {
                                                           this.setState({writeIn: e.target.value})
                                                       }}/>
                                                <label className="form-check-label">
                                                    <FormattedMessage id={OPTIONS}/>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="form-group">
                                            <label htmlFor="cloze-text"><FormattedMessage id={CLOZE_TEXT}/>:</label>
                                            <textarea
                                                className="input-mcq"
                                                rows="5"
                                                id="cloze-text"
                                                required
                                                value={this.state.clozetext}
                                                onChange={this.handleChangeCloze}
                                            />
                                            {cloze_error}
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
                                                className="btn button-choices-add">

                                            </button>
                                            <button
                                                type="button"
                                                onClick={this.handleRemoveAns}
                                                className="btn button-choices-sub">

                                            </button>
                                        </div>
                                    </div>
                                    <div className="form-group row justify-content-between">
                                        <br/>
                                        <div className="justify-content-end">
                                            <button
                                                onClick={this.submitExercise}
                                                className={"btn button-finish"}
                                                disabled={!this.state.isFormValid}
                                            >
                                                <FormattedMessage id={FINISH_EXERCISE}/>
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
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

export default withRouter(
    connect(MapStateToProps,
        {addNewExercise, incrementExerciseCounter, editExercise}
    )(CLOZEForm));