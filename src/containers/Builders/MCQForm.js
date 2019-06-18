import React, {Component} from "react";
import {connect} from "react-redux";
import {incrementExerciseCounter} from "../../store/actions/increment_counter";
import {addNewExercise, editExercise} from "../../store/actions/exercises";
import {FormattedMessage} from 'react-intl';
import datastore from 'lib/sugar-web/datastore';
import chooser from 'lib/sugar-web/graphics/journalchooser';
import env from 'lib/sugar-web/env';
import meSpeak from 'mespeak';
import withMultimedia from '../../components/WithMultimedia';
import {
    QUESTION,
    FINISH_EXERCISE,
    TITLE_OF_EXERCISE,
    CORRECT_OPTION,
    WRONG_OPTION,
    NEXT_QUESTION,
    PREVIOUS_QUESTION,
    TEST_EXERCISE,
    TITLE_ERROR,
    QUESTION_ERROR,
    ANSWER_ERROR,
    MCQ,
    TEXT
} from "../translation";
import {withRouter} from "react-router-dom"
import "../../css/MCQForm.css"

class MCQForm extends Component {

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
                options: false,
                title: false
            },
            currentQuestion: {
                id: 1,
                question: {
                    type: '',
                    data: ''
                },
                options: [{type: '', data: ''}, {type: '', data: ''}] 
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
            const {id, title, questions, scores, times} = this.props.location.state.exercise;
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
                currentQuestion: currentQuestion
            });
        }
    }

    handleChangeOption = e => {
        const index = Number(e.target.name.split('-')[1]);
        const options = this.state.currentQuestion.options.map((option, i) => (
            i === index ? {type: option.type, data: e.target.value} : option
        ));

        let error = false;
        if (e.target.value === '') {
            error = true;
        }
        this.setState({
            ...this.state,
            currentQuestion: {
                ...this.state.currentQuestion, 
                options: options
            },
            errors: {
                ...this.state.errors,
                options : error
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

    handleRemoveOption = () => {
        let {currentQuestion} = this.state;
        let {options} = currentQuestion;
        if (options.length > 2) {
            options.pop();
            this.setState({
                ...this.state,
                currentQuestion: {
                    ...currentQuestion, 
                    options: options
                    }
                }, () => {
                    this.checkFormValidation();
                }
            )
        }
    };

    handleNewOption = () => {
        const {currentQuestion} = this.state;
        this.setState({
            ...this.state,
            currentQuestion: {
                ...currentQuestion,
                options: [...currentQuestion.options, {type: '', data: ''}]
            }
        },
            () => {
                this.checkFormValidation();
            }
        )
    };

    handleNewEvent = event => {
        event.preventDefault();
    };

    // save current question
    saveCurrentForm = () => {
        this.checkFormValidation();

        if (this.state.isFormValid) {
            const {currentQuestionNo, noOfQuestions} = this.state;
            const {question, options} = this.state.currentQuestion;

            const correctAns = options[0];
            const id = currentQuestionNo;

            let Ques = {
                id: id,
                options: options,
                question: question,
                correctAns: correctAns
            };

            let isFormValid = false;
            if(currentQuestionNo + 1 <= noOfQuestions)
                isFormValid = true;

            if (currentQuestionNo > noOfQuestions) {
                this.setState({
                    ...this.state,
                    questions: [
                        ...this.state.questions,
                        Ques
                    ],
                    isFormValid: isFormValid,
                    noOfQuestions: id,
                    currentQuestionNo: id + 1,
                    currentQuestion: {
                        id: id + 1,
                        question: {
                            type: '',
                            data: ''
                        },
                        options: [{type: '', data: ''}, {type: '', data: ''}] 
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
                        isFormValid: isFormValid,
                        currentQuestionNo: currentQuestionNo + 1,
                        currentQuestion: {
                            id: currentQuestionNo + 1,
                            question: {
                                type: '',
                                data: ''
                            },
                            options: [{type: '', data: ''}, {type: '', data: ''}] 
                        }
                    });
                } else {
                    const {question, options, correctAns} = this.state.questions[index];
                    let correct = correctAns;
                    if (correctAns.data === '') {
                        correct = options[0];
                    }

                    this.setState({
                        ...this.state,
                        questions: updatedQuestions,
                        isFormValid: isFormValid,
                        currentQuestionNo: index + 1,
                        currentQuestion: {
                            id: index + 1,
                            question: question,
                            options: options,
                            correctAns: correct
                        }
                    });
                }
            }
        }
    };

    // check if current form is valid
    checkFormValidation = () => {
        const {currentQuestion, title} = this.state;
        const {question, options} = currentQuestion;
        let isFormValid = true;

        if(!question.type)
            isFormValid  = false;
        
        if ((question.type === this.multimedia.text || question.type === this.multimedia.textToSpeech)
             && question.data === '') {
            isFormValid = false;
        }

        if (title === '') {
            isFormValid = false;
        }

        options.forEach((option, i) => {
            if (option.data === '') {
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
            type: "MCQ",
            questions: this.state.questions,
            scores: this.state.scores,
            times: this.state.times,
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
            this.props.history.push('/play/mcq', {exercise: exercise, edit: true});
        else
            this.props.history.push('/')    };

    // move to previous question
    previousQues = () => {
        const {currentQuestionNo} = this.state;
        let previousQuestionNo = currentQuestionNo - 1;
        let previousQuestion = this.state.questions[previousQuestionNo - 1];

        const {id, question, options} = previousQuestion;
        let currentQuestion = {
            id: id,
            question: question,
            options: options
        };

        this.setState({
            ...this.state,
            isFormValid: true,
            currentQuestionNo: id,
            currentQuestion: currentQuestion
        })
    };

    showJournalChooser = (mediaType, options = true, optionNo = -1) => {
        const {currentQuestion} = this.state;

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
                        if(options){
                            let options = currentQuestion.options;
                            options[optionNo] = {type: mediaType, data: text};
                            this.setState({
                                ...this.state,
                                currentQuestion:{
                                    ...currentQuestion,
                                    options: options
                                }
                            },() => {
                                this.checkFormValidation();
                            });
                        } else{
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

    selectOptionType = (mediaType, optionNo) => {
        const {currentQuestion} = this.state;
        if(mediaType === this.multimedia.text || mediaType === this.multimedia.textToSpeech) {
            let {options} = currentQuestion;
            options[optionNo] = {type: mediaType, data: ''};
            this.setState({
                ...this.state,
                currentQuestion:{
                    ...currentQuestion,
                    options: options
                }
            },() => {
                this.checkFormValidation();
            });
        } else {
            this.showJournalChooser(mediaType, true, optionNo)
        }
    }

    resetOption = (OptionNo)=>{
        const {currentQuestion} = this.state;
        let {options} = currentQuestion;
        options[OptionNo] = {type: '', data: ''};  
        this.setState({
            ...this.state,
            currentQuestion: {
                ...currentQuestion,
                options:options
                }
        });
    }

    render() {
        const {currentQuestion, errors} = this.state;
        const {id, options} = currentQuestion;
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
        
        // Answer-Options
        let answerOptions = options.map((option, i) => {
            if(!option.type)
                return (
                    <div className="question-options" key={`options-${i}`}>
                        <label htmlFor={`answer-${i}`}>
                            {i + 1}
                        </label>
                        <button className="btn button-answer-options button-text col-md-1" 
                            onClick={() => {
                                    this.selectOptionType(this.multimedia.text, i);
                                }}>
                            <FormattedMessage id={TEXT}/>
                        </button>
                        <button className="btn button-answer-options button-image col-md-1" 
                            onClick={() => {
                                this.selectOptionType(this.multimedia.image, i);
                            }}>                            
                        </button>
                        <button className="btn button-answer-options button-audio col-md-1" 
                            onClick={() => {
                                this.selectOptionType(this.multimedia.audio, i);
                                }}>                        
                        </button>
                        <button className="btn button-answer-options button-text-to-speech col-md-1" 
                            onClick={() => {
                                this.selectOptionType(this.multimedia.textToSpeech, i)}}>
                        </button>
                        <button className="btn button-answer-options button-video col-md-1" 
                            onClick={() => {
                                this.selectOptionType(this.multimedia.video, i);
                            }}>
                        </button>
                        <span className = "options-placeholder">
                            <FormattedMessage id={i===0?CORRECT_OPTION:WRONG_OPTION}/>
                        </span>
                    </div>
                );
            else {
                let optionElement;
                let optionsType = option.type;
                if( optionsType === this.multimedia.text)
                    optionElement = (
                        <div className="answers">
                            <input
                                className="answers input-ans"
                                type="text"
                                id="option"
                                name={`option-${i}`}
                                value={option.data}
                                onChange={this.handleChangeOption}
                                style={{width: 'auto'}}
                            />
                            <button className="btn button-choices-edit" 
                                    style={{marginLeft: '5px'}}                               
                                    onClick={()=>{this.resetOption(i)}}>
                            </button>
                        </div>
                    );
                if( optionsType === this.multimedia.image)
                    optionElement = (
                        <div className="answers">
                            <div className = "media-background answers">
                                <img src = {option.data}
                                        style = {{height: '100px'}}
                                        onClick = {()=>{showMedia(option.data)}}
                                        alt="Option"/>
                            </div>                    
                            <button className="btn button-choices-edit" 
                                    style={{marginLeft: '5px'}}                               
                                    onClick={()=>{this.resetOption(i)}}>
                            </button>
                        </div>    
                    );
                if( optionsType === this.multimedia.audio)
                    optionElement = (
                        <div className="answers" style={{marginBottom: '10px'}}>
                            <audio  className="answers vertical-align"
                                    src={option.data}
                                    controls>
                            </audio>
                            <button className="btn button-choices-edit" 
                                    style={{marginLeft: '5px'}}                               
                                    onClick={()=>{this.resetOption(i)}}>
                            </button>
                        </div>
                    );
                if( optionsType === this.multimedia.textToSpeech)
                    optionElement = (
                        <div className="answers">
                            <input
                                className="answers input-ans"
                                id="option"
                                type="text"
                                name={`option-${i}`}
                                value={option.data}
                                onChange={this.handleChangeOption}
                                style={{width: 'auto'}}
                            />
                            <button className="btn button-finish button-speaker button-off" 
                                    onClick={(e)=>{this.speak(e, option.data)}}>
                            </button>
                            <button className="btn button-choices-edit" 
                                    style={{marginLeft: '5px'}}                               
                                    onClick={()=>{this.resetOption(i)}}>
                            </button>
                        </div>
                    );
                if( optionsType === this.multimedia.video)
                    optionElement = (
                        <div className="answers">
                            <div className="media-background answers vertical-align">
                                <video src={option.data} controls
                                        height="100px">
                                </video>
                            </div>
                            <button className="btn button-choices-edit" 
                                    style={{marginLeft: '5px'}}                               
                                    onClick={()=>{this.resetOption(i)}}>
                            </button>
                        </div>
                    );
                return (
                    <div className="option" key={`options-${i}`}>
                        <label htmlFor={`answer-${i}`}>
                            {i + 1}
                        </label>
                        {optionElement}
                    </div>
                )
            }
        });

        let title_error = '';
        let question_error = '';
        let options_error = '';

        if (errors['title']) {
            title_error = <span style={{color: "red"}}><FormattedMessage id={TITLE_ERROR}/></span>;
        }
        if (errors['question']) {
            question_error = <span style={{color: "red"}}><FormattedMessage id={QUESTION_ERROR}/></span>;
        }
        if (errors['options']) {
            options_error = <span style={{color: "red"}}><FormattedMessage id={ANSWER_ERROR}/></span>;
        }

        return (
            <div className="container">
            <div className="container-fluid">
                <div className="row align-items-center justify-content-center">
                    <div className="col-sm-10">
                        <div>
                            <p><strong><FormattedMessage id={MCQ}/></strong></p>
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
                                                className="input-mcq"
                                                type="text"
                                                id="title"
                                                value={this.state.title}
                                                onChange={this.handleChangeTitle}
                                            />
                                            {title_error}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="form-group">
                                            <label htmlFor="question">{id}. <FormattedMessage id={QUESTION}/>:</label>
                                            {questionType && <button className="btn button-edit" 
                                                onClick={() => {this.setState({...this.state, currentQuestion:{...currentQuestion, question:{type:'', data:''}}})}}>
                                            </button>}
                                            {!questionType && questionOptions}
                                            {questionType && question}
                                            {questionType === this.multimedia.text && question_error}
                                        </div>
                                    </div>
                                    {answerOptions}
                                    <div>
                                        {options_error}
                                    </div>
                                    <div className="row">
                                        <div className="form-group">
                                            <button
                                                type="button"
                                                onClick={this.handleNewOption}
                                                className="btn button-choices-add">

                                            </button>
                                            <button
                                                type="button"
                                                onClick={this.handleRemoveOption}
                                                className="btn button-choices-sub">

                                            </button>
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
    )(MCQForm)));