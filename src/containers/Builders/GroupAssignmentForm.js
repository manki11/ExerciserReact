import React, {Component} from "react";
import {connect} from "react-redux";
import {incrementExerciseCounter} from "../../store/actions/increment_counter";
import {addNewExercise, editExercise} from "../../store/actions/exercises";
import {FormattedMessage} from 'react-intl';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import {
    FINISH_EXERCISE,
    TITLE_OF_EXERCISE,
    NEXT_QUESTION,
    PREVIOUS_QUESTION,
    TEST_EXERCISE,
    TITLE_ERROR,
    QUESTION_ERROR,
    ANSWER_ERROR,
    GROUP_ASSIGNMENT,
    TEXT,
    MATCH_ITEM
} from "../translation";
import {withRouter} from "react-router-dom";
import "../../css/GroupAssignmentForm.css";
import datastore from 'lib/sugar-web/datastore';
import chooser from 'lib/sugar-web/graphics/journalchooser';
import env from 'lib/sugar-web/env';
import meSpeak from 'mespeak';
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
            groups:[{type:'', data: ''},{type:'', data: ''}],
            currentQuestion: {
                id: 1,
                question: {type:'', data: ''},
                answer: {type:'', data: ''},
                correctGroup: ''
            }
        };

        this.multimedia = {
            text: 'text',
            image: 'image',
            audio: 'audio',
            textToSpeech: 'text-to-speech',
            video: 'video'
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
            i === index ? {type:group.type, data: e.target.value} : group
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
                correctGroup: value
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
                question: {
                    ...this.state.currentQuestion.question,
                    data: e.target.value
                }
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
                    groups: [...groups, {type:'', data:''}],
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
            const {question, answer, correctGroup} = this.state.currentQuestion;

            let id = currentQuestionNo;

            let Ques = {
                id: id,
                answer: answer,
                question: question,
                correctGroup: correctGroup
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
                        question: {type:'', data: ''},
                        answer: {type:'', data: ''},
                        correctGroup: ''
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
                            question: {type:'', data: ''},
                            answer: {type:'', data: ''},
                            correctGroup: ''
                        }
                    });
                } else {
                    const {question, answer, correctGroup} = this.state.questions[index];

                     this.setState({
                        ...this.state,
                        questions: updatedQuestions,
                        isFormValid: true,
                        currentQuestionNo: index + 1,
                        currentQuestion: {
                            id: index + 1,
                            question: question,
                            answer: answer,
                            correctGroup: correctGroup
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
        const {question, correctGroup} = currentQuestion;
        let isFormValid = true;

        if (question.type === '' || question.data === '') {
            isFormValid = false;
        }

        if (title === '') {
            isFormValid = false;
        }

        if (correctGroup === '') {
            isFormValid = false;
        }

        groups.forEach((group, i) => {
            if (group.type === '' || group.data === '') {
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
        const {questions, groups, currentQuestion} = this.state;

        let updatedQuestions = questions.map((question)=>{
            return {
                id: question.id,
                question: question.question,
                correctGroup: question.correctGroup,
                answer: groups[question.correctGroup.split('-').pop() - 1]
            }
        })

        // To save changes before testing the exercise
        if(currentQuestion.id <= questions.length){
            let updatedCurrentQuestion = {
                id: currentQuestion.id,
                question: currentQuestion.question,
                correctGroup: currentQuestion.correctGroup,
                answer: groups[currentQuestion.correctGroup.split('-').pop() - 1]
            };
            updatedQuestions[currentQuestion.id -1] = updatedCurrentQuestion;
        } else {
            updatedQuestions.push({
                id: currentQuestion.id,
                question: currentQuestion.question,
                correctGroup: currentQuestion.correctGroup,
                answer: groups[currentQuestion.correctGroup.split('-').pop() - 1]
            });
        }

        let id = this.state.id;
        if (this.state.id === -1) {
            id = this.props.counter;
        }

        let exercise = {
            title: this.state.title,
            id: id,
            type: "GROUP_ASSIGNMENT",
            questions: updatedQuestions,
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
        const {id, question, answer, correctGroup} = previousQuestion;
        let currentQuestion = {
            id: id,
            question: question,
            answer: answer,
            correctGroup: correctGroup
        };
        this.setState({
            ...this.state,
            isFormValid: true,
            currentQuestionNo: id,
            currentQuestion: currentQuestion
        })
    };

    showJournalChooser = (mediaType, groups = false, groupNo = -1) => {
        let image, audio, video = false;
        if(mediaType === this.multimedia.image)
            image = true;
        if(mediaType === this.multimedia.audio)
            audio = true;
        if(mediaType === this.multimedia.video)
            video = true;
        env.getEnvironment((err, environment) => {
            if(environment.user) {
                // Display journal dialog popup
                chooser.show((entry) => {
                    if (!entry) {
                          return;
                    }
                    var dataentry = new datastore.DatastoreObject(entry.objectId);
                    dataentry.loadAsText((err, metadata, text) => {
                        if(groups){
                            let {groups} = this.state;
                            groups[groupNo] = {type: mediaType, data: text};
                            this.setState({
                                ...this.state,
                                groups: groups
                            },() => {
                                this.checkFormValidation();
                            });
                        } else{
                            let {currentQuestion} = this.state;
                            this.setState({
                                ...this.state,
                                currentQuestion:{
                                    ...currentQuestion,
                                    question:{
                                        type: mediaType,
                                        data: text
                                    }
                                }
                            },() => {
                                this.checkFormValidation();
                            });
                        }
                    });
                }, (image?{mimetype: 'image/png'}:null),
                    (image?{mimetype: 'image/jpeg'}:null),
                    (audio?{mimetype: 'audio/wav'}:null),
                    (video?{mimetype: 'video/webm'}:null));
            }
        });
    };

    resetGroup = (groupNo)=>{
        let {groups} = this.state;
        groups[groupNo] = {type: '', data: ''};  
        this.setState({
            ...this.state,
            groups: groups
        });
    }

    selectQuestionType = (mediaType) => {
        const {currentQuestion} = this.state;
        if(mediaType === this.multimedia.text || mediaType === this.multimedia.textToSpeech) {
            this.setState({
                ...this.state,
                currentQuestion:{
                    ...currentQuestion,
                    question: {
                        type: mediaType,
                        data: ''
                    }
                }
            },() => {
                this.checkFormValidation();
            });
        } else {
            this.showJournalChooser(mediaType, false)
        }
    }

    selectGroupType = (mediaType, groupNo) => {
        if(mediaType === this.multimedia.text || mediaType === this.multimedia.textToSpeech) {
            let {groups} = this.state;
            groups[groupNo] = {type: mediaType, data: ''};
            this.setState({
                ...this.state,
                groups: groups
            },() => {
                this.checkFormValidation();
            });
        } else {
            this.showJournalChooser(mediaType, true, groupNo)
        }
    }

    speak = (e, text) => {
        let audioElem = e.target;
        let myDataUrl = meSpeak.speak(text, {rawdata: 'data-url'});
		let sound = new Audio(myDataUrl);
        audioElem.classList.remove("button-off");
        audioElem.classList.add("button-on");
        sound.play();
        sound.onended = () => {
            audioElem.classList.remove("button-on");
            audioElem.classList.add("button-off");
        }
    }

    render() {
        const {currentQuestion, errors, groups} = this.state;
        const {id} = currentQuestion;
        const {thumbnail, insertThumbnail, showMedia} = this.props;

        //Question-Options
        let questionOptions = (
            <div className="question-options">
                <button className="btn button-question-options button-text col-md-2" 
                    onClick={() => {
                            this.selectQuestionType(this.multimedia.text)
                        }}>
                    <FormattedMessage id={TEXT}/>
                </button>
                <button className="btn button-question-options button-image col-md-2" 
                    onClick={() => {
                        this.selectQuestionType(this.multimedia.image);
                    }}>
                </button>
                <button className="btn button-question-options button-audio col-md-2" 
                    onClick={() => {
                        this.selectQuestionType(this.multimedia.audio);
                    }}>
                </button>
                <button className="btn button-question-options button-text-to-speech col-md-2" 
                    onClick={() => {
                        this.selectQuestionType(this.multimedia.textToSpeech);
                        }}>
                </button>
                <button className="btn button-question-options button-video col-md-2" 
                    onClick={() => {
                        this.selectQuestionType(this.multimedia.video);
                    }}>
                </button>
            </div>
        );
        
        let question;
        let questionType = currentQuestion.question.type; 
        if( questionType === this.multimedia.text)
            question = (
                <input
                    className="input-mcq"
                    type="text"
                    id="question"
                    value={currentQuestion.question.data}
                    onChange={this.handleChangeQues}
                />
            );
        if( questionType === this.multimedia.image)
            question = (
                <div className = "media-background">
                   <img src = {currentQuestion.question.data}
                        style = {{height: '200px'}}
                        onClick = {()=>{showMedia(currentQuestion.question.data)}}
                        alt="Question"/>
                </div>
            );
        if( questionType === this.multimedia.audio)
            question = (
                <audio src={currentQuestion.question.data} controls
                        style={{width: '-webkit-fill-available'}}>
                </audio>
            );
        if( questionType === this.multimedia.textToSpeech)
            question = (
                <div>
                    <input
                        className="input-text-to-speech"
                        id="question"
                        value={currentQuestion.question.data}
                        onChange={this.handleChangeQues}
                    />
                    <button className="btn button-finish button-speaker button-off" 
                            onClick={(e)=>{this.speak(e, currentQuestion.question.data)}}>
                    </button>
                </div>
            );
        if( questionType === this.multimedia.video)
            question = (
                <div className="media-background">
                    <video src={currentQuestion.question.data} controls
                            height="250px">
                    </video>
                </div>
            );
        
        let groupOptions = groups.map((group, i) => {
            let question;            
            if(!group.type){
                question = (
                    [
                        <button className="btn button-answer-options button-text col-md-3" key="type-1" 
                                    onClick={() => {
                                            this.selectGroupType(this.multimedia.text, i);
                                        }}>
                                    <FormattedMessage id={TEXT}/>
                        </button>,
                        <button className="btn button-answer-options button-image col-md-3" key="type-2"
                            onClick={() => {
                                this.selectGroupType(this.multimedia.image, i);
                            }}>                            
                        </button>
                    ]
                );
            } else {
                let groupType = group.type; 
                if( groupType === this.multimedia.text)
                    question = (
                        <div className="answers">
                            <input
                                className="answers input-ans"
                                type="text"
                                id="option"
                                name={`option-${i}`}
                                value={group.data}
                                onChange={this.handleChangeGroup}
                                style={{width: 'auto'}}
                            />
                            <button className="btn button-choices-edit" 
                                    style={{marginLeft: '5px'}}                               
                                    onClick={()=>{this.resetGroup(i)}}>
                            </button>
                        </div>
                    );
                if( groupType === this.multimedia.image)
                    question = (
                        <div className="answers">
                            <div className = "media-background answers">
                                <img src = {group.data}
                                        style = {{height: '100px'}}
                                        onClick = {()=>{showMedia(group.data)}}
                                        alt="Option"/>
                            </div>                    
                            <button className="btn button-choices-edit" 
                                    style={{marginLeft: '5px'}}                               
                                    onClick={()=>{this.resetGroup(i)}}>
                            </button>
                        </div>
                    );
            }
            return (
                <div className="col-md-8" key={`groups-${i}`}>
                    <label htmlFor={`group-${i}`}>
                        {i + 1}
                    </label>
                    {question}
                </div>
            )
        });

        let groupSelect = groups.map((group, index) => {
            return {
                value: `Group-${index+1}`,
                label: `Group-${index+1}`
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
                            <p><strong><FormattedMessage id={GROUP_ASSIGNMENT}/></strong></p>
                            <hr className="my-3"/>
                            <div className="col-md-12">
                                <form onSubmit={this.handleNewEvent}>
                                    <div className="row">
                                        <div className="form-group">
                                            {thumbnail}
                                            <label htmlFor="title"><FormattedMessage id={TITLE_OF_EXERCISE}/></label>
                                            <button style={{display: 'none'}}/>
                                            <button className="btn button-finish button-thumbnail" 
                                                    onClick={insertThumbnail}
                                            />
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
                                            <label htmlFor="question">{id}. <FormattedMessage id={MATCH_ITEM}/>:</label>
                                            {questionType && <button className="btn button-edit" 
                                                onClick={() => {this.setState({...this.state, currentQuestion:{...currentQuestion, question:{type:'', data:''}}})}}>
                                            </button>}
                                            {!questionType && questionOptions}
                                            {questionType && question}
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
                                                value={currentQuestion.correctGroup}
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
                                            disabled={!this.state.isFormValid}
                                        >
                                            <FormattedMessage id={FINISH_EXERCISE}/>
                                        </button>
                                        <button
                                            onClick={(e)=> this.submitExercise(true,e)}
                                            className={"btn button-finish"}
                                            disabled={!this.state.isFormValid}
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

export default withMultimedia(require('../../images/group_image.svg'))(withRouter(
    connect(MapStateToProps,
        {addNewExercise, incrementExerciseCounter, editExercise}
    )(GroupAssignmentForm)));