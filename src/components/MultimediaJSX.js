import React from 'react';
import {FormattedMessage} from 'react-intl';
import {TEXT} from '../containers/translation';

let multimedia = {
    text: 'text',
    image: 'image',
    audio: 'audio',
    textToSpeech: 'text-to-speech',
    video: 'video'
};

export function QuestionOptionsJSX(props){
    const {selectQuestionType} = props;
    return (
        <div className="question-options">
            <button className="btn button-question-options button-text col-md-2" 
                onClick={() => {
                        selectQuestionType(multimedia.text)
                    }}>
                <FormattedMessage id={TEXT}/>
            </button>
            <button className="btn button-question-options button-image col-md-2" 
                onClick={() => {
                    selectQuestionType(multimedia.image);
                }}>
            </button>
            <button className="btn button-question-options button-audio col-md-2" 
                onClick={() => {
                    selectQuestionType(multimedia.audio);
                }}>
            </button>
            <button className="btn button-question-options button-text-to-speech col-md-2" 
                onClick={() => {
                    selectQuestionType(multimedia.textToSpeech);
                    }}>
            </button>
            <button className="btn button-question-options button-video col-md-2" 
                onClick={() => {
                    selectQuestionType(multimedia.video);
                }}>
            </button>
        </div>
    );       
}

export function QuestionJSX(props){

    let question;
    let {questionType, questionData, handleChangeQues, showMedia, speak} = props; 
    if( questionType === multimedia.text)
        question = (
            <input
                className="input-mcq"
                type="text"
                id="question"
                value={questionData}
                onChange={handleChangeQues}
            />
        );
    if( questionType === multimedia.image)
        question = (
            <div className = "media-background">
                <img src = {questionData}
                    style = {{height: '200px'}}
                    onClick = {()=>{showMedia(questionData)}}
                    alt="Question"/>
            </div>
        );
    if( questionType === multimedia.audio)
        question = (
            <audio src={questionData} controls
                    style={{width: '-webkit-fill-available'}}>
            </audio>
        );
    if( questionType === multimedia.textToSpeech)
        question = (
            <div>
                <input
                    className="input-text-to-speech"
                    id="question"
                    value={questionData}
                    onChange={handleChangeQues}
                />
                <button className="btn button-finish button-speaker button-off" 
                        onClick={(e)=>{speak(e, questionData)}}>
                </button>
            </div>
        );
    if( questionType === multimedia.video)
        question = (
            <div className="media-background">
                <video src={questionData} controls
                        height="250px">
                </video>
            </div>
        );
    return question;
}
