import React, {Component} from "react";
import {connect} from "react-redux";
import {incrementExerciseCounter} from "../../store/actions/increment_counter";
import {addNewExercise, editExercise} from "../../store/actions/exercises";
import {FormattedMessage} from 'react-intl';
import {withRouter} from "react-router-dom";
import datastore from 'lib/sugar-web/datastore';
import chooser from 'lib/sugar-web/graphics/journalchooser';
import env from 'lib/sugar-web/env';
import meSpeak from 'mespeak';
import withMultimedia from '../../components/WithMultimedia';
import {
    FINISH_EXERCISE,
    QUESTION,
    TITLE_OF_EXERCISE,
    TEST_EXERCISE,
    QUESTION_ERROR,
    LIST_ERROR, TITLE_ERROR, REORDER_LIST,
    TEXT
} from "../translation";
import "../../css/REORDERForm.css";

class REORDERForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            edit: false,
            id: -1,
            title: '',
            question: {
                type: '',
                data: ''
            },
            list: [{ type:'', data: ''},
                { type: '', data:''}],
            scores: [],
            times: [],
            isFormValid: false,
            errors: {
                question: false,
                list: false,
                title: false,
            }
        }

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
            const {id, title, question, scores, times, list} = this.props.location.state.exercise;

            this.setState({
                ...this.state,
                id: id,
                title: title,
                edit: true,
                isFormValid: true,
                question: question,
                scores: scores,
                times: times,
                list: list
            });
        }
    }

    handleChangeOption = e => {
        const index = Number(e.target.name.split('-')[1]);
        const newlist = this.state.list.map((item, i) => (
            i === index ? {type:item.type, data: e.target.value} : item
        ));
        let error = false;
        if (e.target.value === '') {
            error = true;
        }
        this.setState({
            ...this.state,
            list: newlist,
            errors: {
                ...this.state.errors,
                list: error
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

    handleRemoveAns = () => {
        const {list} = this.state;
        if (list.length > 2) {
            list.pop();
            this.setState(
                {list: list},
                () => {
                    this.checkFormValidation();
                }
            )
        }
    };

    handleNewAns = () => {
        this.setState(
            {
                list: [...this.state.list, {type: '', data: ''}]},
            () => {
                this.checkFormValidation();
            }
        )
    };

    changeOrder= (curr, next) => {
        const {list}= this.state;

        if(next> list.length-1 || next<0) return;
        let newList= list.slice();
        let temp= newList[curr];
        newList[curr]= newList[next];
        newList[next]= temp;


        this.setState({list: newList})
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
            question: {
                ...this.state.question,
                data: e.target.value
            }
        }, () => {
            this.checkFormValidation();
        });
    };

    checkFormValidation = () => {
        const {title, question, list} = this.state;
        let isFormValid = true;

        if (question.type === '' || question.data === '') {
            isFormValid = false;
        }

        if (title === '') {
            isFormValid = false;
        }

        list.forEach((item, i) => {
            if (item.type === '' || item.data === '') {
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

    submitExercise = (bool, e) => {
        e.preventDefault();
        const {srcThumbnail, userLanguage} = this.props;
        let id = this.state.id;

        if (this.state.id === -1) {
            id = this.props.counter;
        }

        let exercise = {
            title: this.state.title,
            id: id,
            type: "REORDER",
            times: this.state.times,
            question: this.state.question,
            list: this.state.list,
            thumbnail: srcThumbnail,
            userLanguage: userLanguage,
            scores: this.state.scores,
        };


        if (this.state.edit) {
            this.props.editExercise(exercise);
        } else {
            this.props.addNewExercise(exercise);
            this.props.incrementExerciseCounter();
        }

        if(bool)
            this.props.history.push('/play/reorder', {exercise: exercise, edit: true});
        else
            this.props.history.push('/')
    };

    showJournalChooser = (mediaType, options = false, optionNo = -1) => {
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
                            let {list} = this.state;
                            list[optionNo] = {type: mediaType, data: text};
                            this.setState({
                                ...this.state,
                                list: list
                            },() => {
                                this.checkFormValidation();
                            });
                        } else{
                            this.setState({
                                ...this.state,
                                question:{
                                    type: mediaType,
                                    data: text
                                }
                            },() => {
                                this.checkFormValidation();
                            });
                        }
                    });
                }, (image?{mimetype: 'image/png'}:audio?{mimetype: 'audio/mp3'}:null),
                    (image?{mimetype: 'image/jpeg'}:audio?{mimetype: 'audio/mpeg'}:null),
                    (audio?{mimetype: 'audio/wav'}:video?{mimetype: 'video/mp4'}:null),
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
        if(mediaType === this.multimedia.text || mediaType === this.multimedia.textToSpeech) {
            this.setState({
                ...this.state,
                question: {
                    type: mediaType,
                    data: ''
                }
            },() => {
                this.checkFormValidation();
            });
        } else {
            this.showJournalChooser(mediaType, false)
        }
    }

    selectOptionType = (mediaType, optionNo) => {
        if(mediaType === this.multimedia.text || mediaType === this.multimedia.textToSpeech) {
            let {list} = this.state;
            list[optionNo] = {type: mediaType, data: ''};
            this.setState({
                ...this.state,
                list: list
            },() => {
                this.checkFormValidation();
            });
        } else {
            this.showJournalChooser(mediaType, true, optionNo)
        }
    }

    resetOption = (OptionNo)=>{
        const {list} = this.state;
        list[OptionNo] = {type: '', data: ''};
        this.setState({
            ...this.state,
            list: list
        });
    }

    render() {
        const {errors, list} = this.state;
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
        let questionType = this.state.question.type;
        if( questionType === this.multimedia.text)
            question = (
                <input
                    className="input-mcq"
                    type="text"
                    id="question"
                    value={this.state.question.data}
                    onChange={this.handleChangeQues}
                />
            );
        if( questionType === this.multimedia.image)
            question = (
                <div className = "media-background">
                   <img src = {this.state.question.data}
                        style = {{height: '200px'}}
                        onClick = {()=>{showMedia(this.state.question.data)}}
                        alt="Question"/>
                </div>
            );
        if( questionType === this.multimedia.audio)
            question = (
                <audio src={this.state.question.data} controls
                        style={{width: '-webkit-fill-available'}}>
                </audio>
            );
        if( questionType === this.multimedia.textToSpeech)
            question = (
                <div>
                    <input
                        className="input-text-to-speech"
                        id="question"
                        value={this.state.question.data}
                        onChange={this.handleChangeQues}
                    />
                    <button className="btn button-finish button-speaker button-off"
                            onClick={(e)=>{this.speak(e, this.state.question.data)}}>
                    </button>
                </div>
            );
        if( questionType === this.multimedia.video)
            question = (
                <div className="media-background">
                    <video src={this.state.question.data} controls
                            height="250px">
                    </video>
                </div>
            );

        // Answer-Options
        let lists = list.map((option, i) => {
            if(!option.type)
                return (
                    <div className="question-list" key={`options-${i}`}>
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
                        <div style={{float: 'right'}}>
                            <button className="up-down-button up-button" onClick={()=>this.changeOrder(i,i-1)}/>
                            <button className="up-down-button down-button" onClick={()=>this.changeOrder(i,i+1)}/>
                        </div>
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
                        <div style={{float: 'right'}}>
                            <button className="up-down-button up-button" onClick={()=>this.changeOrder(i,i-1)}/>
                            <button className="up-down-button down-button" onClick={()=>this.changeOrder(i,i+1)}/>
                        </div>
                    </div>
                )
            }
        });

        let title_error = '';
        let question_error = '';
        let list_error = '';

        if (errors['title']) {
            title_error = <span style={{color: "red"}}><FormattedMessage id={TITLE_ERROR}/></span>;
        }
        if (errors['question']) {
            question_error = <span style={{color: "red"}}><FormattedMessage id={QUESTION_ERROR}/></span>;
        }
        if (errors['list']) {
            list_error = <span style={{color: "red"}}><FormattedMessage id={LIST_ERROR}/></span>;
        }

        return (
            <div className="container">
                <div className="container-fluid">
                    <div className="row align-items-center justify-content-center">
                        <div className="col-sm-10">
                        <div>
                        <p><strong><FormattedMessage id={REORDER_LIST}/></strong></p>
                            <hr className="my-3"/>
                            <div className="col-md-12">
                                <form onSubmit={this.handleNewEvent}>
                                    <div className="row">
                                        <div className="form-group">
                                            <div className = "thumbnail">
                                                    <button style={{display: 'none'}}/>
                                                    {thumbnail}
                                            </div>
                                            <label htmlFor="title"><FormattedMessage id={TITLE_OF_EXERCISE}/></label>
                                            <button className="btn button-finish button-thumbnail"
                                                    onClick={insertThumbnail}/>
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
                                            <label htmlFor="question"><FormattedMessage id={QUESTION}/>:</label>
                                            {questionType && <button className="btn button-edit"
                                                onClick={() => {this.setState({...this.state, question:{type:'', data:''}})}}>
                                            </button>}
                                            {!this.state.question.type && questionOptions}
                                            {this.state.question.type && question}
                                            {question_error}
                                        </div>
                                    </div>
                                        {lists}
                                    <div>
                                        {list_error}
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
                                                onClick={(e)=>this.submitExercise(false,e)}
                                                className={"btn button-finish"}
                                                disabled={!this.state.isFormValid}
                                            >
                                                <FormattedMessage id={FINISH_EXERCISE}/>
                                            </button>
                                            <button
                                                onClick={(e)=>this.submitExercise(true, e)}
                                                className={"btn button-finish"}
                                                disabled={!this.state.isFormValid}
                                            >
                                                <FormattedMessage id={TEST_EXERCISE}/>
                                            </button>
                                        </div>
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

export default withMultimedia(require('../../images/list_reorder_image.svg'))(withRouter(
    connect(MapStateToProps,
        {addNewExercise, incrementExerciseCounter, editExercise}
    )(REORDERForm)));
