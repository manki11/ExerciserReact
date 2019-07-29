import React from 'react';
import {FormattedMessage} from 'react-intl';
import {TEXT, WRONG_OPTION, CORRECT_OPTION} from '../containers/translation';
import {MULTIMEDIA} from '../utils';

export function QuestionOptionsJSX(props){
    const {selectQuestionType} = props;
    return (
        <div className="question-options">
            <button className="btn button-question-options button-text col-md-2" 
                onClick={() => {
                        selectQuestionType(MULTIMEDIA.text)
                    }}>
                <FormattedMessage id={TEXT}/>
            </button>
            <button className="btn button-question-options button-image col-md-2" 
                onClick={() => {
                    selectQuestionType(MULTIMEDIA.image);
                }}>
            </button>
            <button className="btn button-question-options button-audio col-md-2" 
                onClick={() => {
                    selectQuestionType(MULTIMEDIA.audio);
                }}>
            </button>
            <button className="btn button-question-options button-text-to-speech col-md-2" 
                onClick={() => {
                    selectQuestionType(MULTIMEDIA.textToSpeech);
                    }}>
            </button>
            <button className="btn button-question-options button-video col-md-2" 
                onClick={() => {
                    selectQuestionType(MULTIMEDIA.video);
                }}>
            </button>
        </div>
    );       
}

export function QuestionJSX(props){

    let question;
    let {questionType, questionData, handleChangeQues, showMedia, speak} = props; 
    if( questionType === MULTIMEDIA.text)
        question = (
            <input
                className="input-mcq"
                type="text"
                id="question"
                value={questionData}
                onChange={handleChangeQues}
            />
        );
    if( questionType === MULTIMEDIA.image)
        question = (
            <div className = "media-background">
                <img src = {questionData}
                    style = {{height: '200px'}}
                    onClick = {()=>{showMedia(questionData)}}
                    alt="Question"/>
            </div>
        );
    if( questionType === MULTIMEDIA.audio)
        question = (
            <audio src={questionData} controls
                    style={{width: '-webkit-fill-available'}}>
            </audio>
        );
    if( questionType === MULTIMEDIA.textToSpeech)
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
    if( questionType === MULTIMEDIA.video)
        question = (
            <div className="media-background">
                <video src={questionData} controls
                        height="250px">
                </video>
            </div>
        );
    return question;
}

export function AnswerOptionsJSX(props){

    const {selectOptionType, resetOption, showMedia, speak, options, changeOrder, handleChangeOption, templateType} = props;
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
                                selectOptionType(MULTIMEDIA.text, i);
                            }}>
                        <FormattedMessage id={TEXT}/>
                    </button>
                    <button className="btn button-answer-options button-image col-md-1" 
                        onClick={() => {
                            selectOptionType(MULTIMEDIA.image, i);
                        }}>                            
                    </button>
                    <button className="btn button-answer-options button-audio col-md-1" 
                        onClick={() => {
                            selectOptionType(MULTIMEDIA.audio, i);
                            }}>                        
                    </button>
                    <button className="btn button-answer-options button-text-to-speech col-md-1" 
                        onClick={() => {
                            selectOptionType(MULTIMEDIA.textToSpeech, i)}}>
                    </button>
                    <button className="btn button-answer-options button-video col-md-1" 
                        onClick={() => {
                            selectOptionType(MULTIMEDIA.video, i);
                        }}>
                    </button>
                    {templateType === 'MCQ' && <span className = "options-placeholder">
                        <FormattedMessage id={i===0?CORRECT_OPTION:WRONG_OPTION}/>
                    </span>}
                    {templateType === 'REORDER' &&  
                        <div style={{float: 'right'}}>
                            <button className="up-down-button up-button" onClick={()=>changeOrder(i,i-1)}/>
                            <button className="up-down-button down-button" onClick={()=>changeOrder(i,i+1)}/>
                        </div>
                    }
                </div>
            );
        else {
            let optionElement;
            let optionsType = option.type;
            if( optionsType === MULTIMEDIA.text)
                optionElement = (
                    <div className="answers">
                        <input
                            className="answers input-ans"
                            type="text"
                            id="option"
                            name={`option-${i}`}
                            value={option.data}
                            onChange={handleChangeOption}
                            style={{width: 'auto'}}
                        />
                        <button className="btn button-choices-edit" 
                                style={{marginLeft: '5px'}}                               
                                onClick={()=>{resetOption(i)}}>
                        </button>
                    </div>
                );
            if( optionsType === MULTIMEDIA.image)
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
                                onClick={()=>{resetOption(i)}}>
                        </button>
                    </div>    
                );
            if( optionsType === MULTIMEDIA.audio)
                optionElement = (
                    <div className="answers" style={{marginBottom: '10px'}}>
                        <audio  className="answers vertical-align"
                                src={option.data}
                                controls>
                        </audio>
                        <button className="btn button-choices-edit" 
                                style={{marginLeft: '5px'}}                               
                                onClick={()=>{resetOption(i)}}>
                        </button>
                    </div>
                );
            if( optionsType === MULTIMEDIA.textToSpeech)
                optionElement = (
                    <div className="answers">
                        <input
                            className="answers input-ans"
                            id="option"
                            type="text"
                            name={`option-${i}`}
                            value={option.data}
                            onChange={handleChangeOption}
                            style={{width: 'auto'}}
                        />
                        <button className="btn button-finish button-speaker button-off" 
                                onClick={(e)=>{speak(e, option.data)}}>
                        </button>
                        <button className="btn button-choices-edit" 
                                style={{marginLeft: '5px'}}                               
                                onClick={()=>{resetOption(i)}}>
                        </button>
                    </div>
                );
            if( optionsType === MULTIMEDIA.video)
                optionElement = (
                    <div className="answers">
                        <div className="media-background answers vertical-align">
                            <video src={option.data} controls
                                    height="100px">
                            </video>
                        </div>
                        <button className="btn button-choices-edit" 
                                style={{marginLeft: '5px'}}                               
                                onClick={()=>{resetOption(i)}}>
                        </button>
                    </div>
                );
            return (
                <div className="option" key={`options-${i}`}>
                    <label htmlFor={`answer-${i}`}>
                        {i + 1}
                    </label>
                    {optionElement}
                    {templateType === 'REORDER' &&  
                        <div style={{float: 'right'}}>
                            <button className="up-down-button up-button" onClick={()=>changeOrder(i,i-1)}/>
                            <button className="up-down-button down-button" onClick={()=>changeOrder(i,i+1)}/>
                        </div>
                    }
                </div>
            )
        }
    });

    return answerOptions;
}

export function PlayerMultimediaJSX(props){
    const {questionType, questionData, showMedia, speak, willSpeak, className, height} = props;
    let questionElement;
    if( questionType === MULTIMEDIA.text)
        questionElement = (
            <p style={{overflow: 'auto', marginBottom: '0px'}}>
                {questionData}
            </p>
        );
    if( questionType === MULTIMEDIA.image)
        questionElement = (
            <img src = {questionData}
                className = {`${className}`}               
                onClick = {()=>{showMedia(questionData)}}
                alt="Question"
                height = {height}
                />
        );
    if( questionType === MULTIMEDIA.audio)
        questionElement = (
            <audio 
                className='width-audio'
                src={questionData} controls>
            </audio>
        );
    if( questionType === MULTIMEDIA.textToSpeech) {
        questionElement = (
            <img className={` button-off ${className}`} 
                onClick={(e)=>{
                    if(willSpeak)
                        speak(e.target, questionData);
                    }}
                alt="text-to-speech-question"
            />
        );
    }
    if( questionType === MULTIMEDIA.video)
        questionElement = (
            <video src={questionData} controls
                    onClick={()=>{showMedia(questionData, MULTIMEDIA.video)}}
                className = {`${className}`}
                height = {height}>  
            </video>
        );
    return questionElement;
}