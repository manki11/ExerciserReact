import React, {Component} from "react";
import {connect} from "react-redux";
import {incrementExerciseCounter} from "../../store/actions/increment_counter";
import {addNewExercise, editExercise} from "../../store/actions/exercises";
import {FormattedMessage} from 'react-intl';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import {
    QUESTION,
    FINISH_EXERCISE,
    TITLE_OF_EXERCISE,
    NEXT_QUESTION,
    PREVIOUS_QUESTION,
    TEST_EXERCISE,
    TITLE_ERROR,
    QUESTION_ERROR,
    ANSWER_ERROR,
} from "../translation";
import {withRouter} from "react-router-dom"
import "../../css/GroupAssignmentForm.css"
import withMultimedia from '../../components/WithMultimedia';

class GroupAssignmentForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            edit: false,
            id: -1,
            title: '',
            noOfQuestions: 0,
            currentQuestionNo: 1,
            questions: [],
            scores: [],
            times: [],
            isFormValid: false,
            errors: {
                question: false,
                title: false,
                groups: false
            },
            groups:['',''],
            currentQuestion: {
                id: 1,
                question: "",
                answer: "",
            }
        };
    }

    // in case of edit load the exercise
    componentDidMount() {
        if (this.props.location.state) {
            const {id, title, questions, scores, times, groups} = this.props.location.state.exercise;
            const currentQuestion = questions[0];
            this.setState({
                ...this.state,
                id: id,
                title: title,
                edit: true,
                isFormValid: true,
                questions: questions,
                scores: scores,
                times: times,
                noOfQuestions: questions.length,
                groups:groups,
                currentQuestion: currentQuestion
            });
        }
    }

    handleChangeGroup = e => {
        const index = Number(e.target.name.split('-')[1]);
        const groups = this.state.groups.map((group, i) => (
            i === index ? e.target.value : group
        ));
        let error = false;
        if (e.target.value === '') {
            error = true;
        }
        this.setState({
            ...this.state,
            groups: groups,
            errors: {
                ...this.state.errors,
                groups: error
            }
        }, () => {
            this.checkFormValidation();
        });
    };

    handleChangeAnsSelect = (text, name) => {
        let value = '';
        if (!text) {
            value = '';
        } else {
            value = text.value;
        }
        this.setState({
            ...this.state,
            currentQuestion:{
                ...this.state.currentQuestion,
                answer: value
            }
        }, () => {
                this.checkFormValidation();
            }
        );
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
            currentQuestion: {
                ...this.state.currentQuestion,
                question: e.target.value
            }
        }, () => {
            this.checkFormValidation();
        });
    };

    handleRemoveGroup = () => {
        const {groups} = this.state;
        if (groups.length > 2) {
            groups.pop();
            this.setState({
                ...this.state,
                groups: groups
                }, () => {
                    this.checkFormValidation();
                }
            )
        }
    };

    handleNewGroup = () => {
        const {groups} = this.state;
        if (groups.length < 4) {
            this.setState(
                this.setState({
                    ...this.state,
                    groups: [...groups, ''],
                    }, () => {
                        this.checkFormValidation();
                    }
                )
            )
        }
    };

    handleNewEvent = event => {
        event.preventDefault();
    };

    // save current question
    saveCurrentForm = () => {
        this.checkFormValidation();

        if (this.state.isFormValid) {
            const {currentQuestionNo, noOfQuestions} = this.state;
            const {question, answer} = this.state.currentQuestion;

            let id = currentQuestionNo;

            let Ques = {
                id: id,
                answer: answer,
                question: question,
            };

            if (currentQuestionNo > noOfQuestions) {
                this.setState({
                    ...this.state,
                    questions: [
                        ...this.state.questions,
                        Ques
                    ],
                    isFormValid: false,
                    noOfQuestions: id,
                    currentQuestionNo: id + 1,
                    currentQuestion: {
                        id: id + 1,
                        question: "",
                        answer: "",
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
                        isFormValid: false,
                        currentQuestionNo: currentQuestionNo + 1,
                        currentQuestion: {
                            id: currentQuestionNo + 1,
                            question: '',
                            answer: "",
                        }
                    });
                } else {
                    const {question, answer} = this.state.questions[index];

                     this.setState({
                        ...this.state,
                        questions: updatedQuestions,
                        isFormValid: false,
                        currentQuestionNo: index + 1,
                        currentQuestion: {
                            id: index + 1,
                            question: question,
                            answer: answer,
                        }
                    }, () => {

                    });
                }
            }
        }
    };

    // check if current form is valid
    checkFormValidation = () => {
        const {currentQuestion, title, groups} = this.state;
        const {question, answer} = currentQuestion;
        let isFormValid = true;

        if (question === '') {
            isFormValid = false;
        }

        if (title === '') {
            isFormValid = false;
        }

        if (answer === '') {
            isFormValid = false;
        }

        groups.forEach((group, i) => {
            if (group === '') {
                isFormValid = false;
            }
        });

        this.setState({
            ...this.state,
            isFormValid: isFormValid
        });
    };

    // submit exercise
    submitExercise = (bool,e) => {
        e.preventDefault();
        const {srcThumbnail, userLanguage} = this.props;

        let id = this.state.id;
        if (this.state.id === -1) {
            id = this.props.counter;
        }

        let exercise = {
            title: this.state.title,
            id: id,
            type: "GROUP_ASSIGNMENT",
            questions: this.state.questions,
            scores: this.state.scores,
            times: this.state.times,
            groups: this.state.groups,
            thumbnail: srcThumbnail,
            userLanguage: userLanguage
        };

        if (this.state.edit) {
            this.props.editExercise(exercise);
        } else {
            this.props.addNewExercise(exercise);
            this.props.incrementExerciseCounter();
        }

        if(bool)
            this.props.history.push('/play/group', {exercise: exercise, edit: true});
        else
            this.props.history.push('/')    };

    // move to previous question
    previousQues = () => {
        const {currentQuestionNo} = this.state;
        let previousQuestionNo = currentQuestionNo - 1;

        let previousQuestion = this.state.questions[previousQuestionNo - 1];
        const {id, question, answer} = previousQuestion;
        let currentQuestion = {
            id: id,
            question: question,
            answer: answer
        };
        this.setState({
            ...this.state,
            currentQuestionNo: id,
            currentQuestion: currentQuestion
        })
    };

    render() {
        const {currentQuestion, errors, groups} = this.state;
        const {id} = currentQuestion;
        let groupOptions = groups.map((group, i) => {
            return (
                <div className="row" key={`groups-${i}`}>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label htmlFor={`group-${i}`}>
                                {i + 1}
                            </label>
                            <input
                                className="answers input-ans"
                                name={`group-${i}`}
                                type="text"
                                value={group}
                                onChange={this.handleChangeGroup}/>
                        </div>
                    </div>
                </div>
            )
        });

        let groupSelect = groups.map((group, index) => {
            return {
                value: group,
                label: group
            }
        });

        let title_error = '';
        let group_error = '';
        let question_error = '';

        if (errors['title']) {
            title_error = <span style={{color: "red"}}><FormattedMessage id={TITLE_ERROR}/></span>;
        }
        if (errors['group']) {
            group_error = <span style={{color: "red"}}><FormattedMessage id={ANSWER_ERROR}/></span>;
        }
        if (errors['question']) {
            question_error = <span style={{color: "red"}}><FormattedMessage id={QUESTION_ERROR}/></span>;
        }
        
        return (
            <div className="container">
            <div className="container-fluid">
                <div className="row align-items-center justify-content-center">
                    <div className="col-sm-10">
                        <div>
                            <p><strong>GROUP ASSIGNMENT</strong></p>
                            <hr className="my-3"/>
                            <div className="col-md-12">
                                <form onSubmit={this.handleNewEvent}>
                                    <div className="row">
                                        <div className="form-group">
                                            <label htmlFor="title"><FormattedMessage id={TITLE_OF_EXERCISE}/></label>
                                            <input
                                                className="input-groupAssign"
                                                type="text"
                                                id="title"
                                                value={this.state.title}
                                                onChange={this.handleChangeTitle}
                                            />
                                            {title_error}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="form-group groups">
                                            <label htmlFor="Correct-Group">Groups: </label>
                                            {groupOptions}
                                            {group_error}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="form-group">
                                            <button
                                                type="button"
                                                onClick={this.handleNewGroup}
                                                className="btn button-choices-add">

                                            </button>
                                            <button
                                                type="button"
                                                onClick={this.handleRemoveGroup}
                                                className="btn button-choices-sub">

                                            </button>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="form-group">
                                            <label htmlFor="question">{id}. <FormattedMessage id={QUESTION}/>:</label>
                                            <input
                                                className="input-mcq"
                                            type="text"
                                                id="question"
                                                value={this.state.currentQuestion.question}
                                                onChange={this.handleChangeQues}
                                            />
                                            {question_error}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="form-group">
                                            <label htmlFor="Correct-Group">Correct Group: </label>
                                            <Select
                                                key={`answer-${currentQuestion.id}`}
                                                className="answers input-ans"
                                                name={`answer-${currentQuestion.id}`}
                                                value={currentQuestion.answer}
                                                onChange={value => this.handleChangeAnsSelect(value, `answer-${currentQuestion.id}`)}
                                                options={groupSelect}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group row justify-content-between">
                                        <button
                                            onClick={this.previousQues}
                                            className={"btn button-previous"}
                                            disabled={this.state.currentQuestionNo === 1}
                                        >
                                            <FormattedMessage id={PREVIOUS_QUESTION}/>
                                        </button>
                                        <div className="justify-content-end">
                                            <button
                                                onClick={this.saveCurrentForm}
                                                className={"btn button-next"}
                                                disabled={!this.state.isFormValid}
                                            >
                                                <FormattedMessage id={NEXT_QUESTION}/>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="form-group row justify-content-between">
                                        <button
                                            onClick={(e)=>this.submitExercise(false,e)}
                                            className={"btn button-finish"}
                                            disabled={!this.state.noOfQuestions >= 1}
                                        >
                                            <FormattedMessage id={FINISH_EXERCISE}/>
                                        </button>
                                        <button
                                            onClick={(e)=> this.submitExercise(true,e)}
                                            className={"btn button-finish"}
                                            disabled={!this.state.noOfQuestions >= 1}
                                        >
                                            <FormattedMessage id={TEST_EXERCISE}/>
                                        </button>
                                    </div>
                                </form>
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
    return {
        counter: state.exercise_counter
    }
}

export default withMultimedia(require('../../images/mcq_image.svg'))(withRouter(
    connect(MapStateToProps,
        {addNewExercise, incrementExerciseCounter, editExercise}
    )(GroupAssignmentForm)));