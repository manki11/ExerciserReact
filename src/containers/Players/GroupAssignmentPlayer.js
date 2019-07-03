import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {addScoreTime} from '../../store/actions/exercises';
import "../../css/GroupAssignmentPlayer.css"
import {SUBMIT_QUESTION, NEXT_QUESTION, FINISH_EXERCISE} from "../translation";
import {FormattedMessage} from 'react-intl';
import {jsPlumb} from 'jsplumb';
import meSpeak from 'mespeak';
import withMultimedia from '../../components/WithMultimedia';

class GroupAssignmentPlayer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: -1,
            title: '',
            questions: [],
            noOfQuestions: 1,
            currentQuestionNo: 1,
            submitted: false,
            selected: false,
            selectedAns: {type: '', data: ''},
            scores: [],
            times: [],
            currentTime: 0,
            intervalID: -1,
            goBackToEdit: false,
            currentScore: 0,
            finish: false,
            groups:[],
            currentQuestion: {
                id: 1,
                question: {type:'', data: ''},
                answer: {type: '', data: ''},
            },
            userLanguage: ''
        }
        this.jsPlumbInstance = jsPlumb.getInstance();
        this.multimedia = {
            text: 'text',
            image: 'image',
            audio: 'audio',
            textToSpeech: 'text-to-speech',
            video: 'video'
        };
    }

    // load the exercise from props
    componentDidMount() {
        if (this.props.location.state) {
            let intervalId = setInterval(this.timer, 1000);
            const {id, title, questions, scores, times, groups, userLanguage} = this.props.location.state.exercise;
            const currentQuestion = questions[0];

            let finish = false;
            if (questions.length === 1) finish = true;

            let goBackToEdit = false;
            if (this.props.location.state.edit) goBackToEdit = true;


            this.setState({
                ...this.state,
                id: id,
                title: title,
                questions: questions,
                noOfQuestions: questions.length,
                intervalID: intervalId,
                scores: scores,
                times: times,
                finish: finish,
                goBackToEdit: goBackToEdit,
                groups:groups,
                userLanguage: userLanguage,
                currentQuestion: currentQuestion,
            },()=>{
                this.initDragDrop();
                if(userLanguage.startsWith('en'))
                    meSpeak.loadVoice(require(`mespeak/voices/en/${this.state.userLanguage}.json`));
                else
                    meSpeak.loadVoice(require(`mespeak/voices/${this.state.userLanguage}.json`));
            })
        }
    }

    initDragDrop = () => {
        this.jsPlumbInstance.draggable("question-drag", { 
            containment: true,
            drag: (e) => {
                let ques = document.getElementById("question-drag");
                ques.classList.remove("before-drag");
                this.setState({
                    ...this.state,
                    selected: true
                })
            }
        });
    
        let groupsDrop = document.getElementsByClassName("group-options");
        this.jsPlumbInstance.droppable(groupsDrop, {
            accept: "question",
            drop: (e) => {
                let index = e.drop.el.id.split('-')[1];
                let selectedAns = this.state.groups[index-1];
                this.setState({
                    ...this.state,
                    selectedAns: selectedAns
                });
            }
        });
    }   


    componentWillUnmount() {
        clearInterval(this.state.intervalID);
    }

    // to measure time
    timer = () => {
        this.setState({currentTime: this.state.currentTime + 1});
    };

    // submit the exercise ( calculate score and time ) show correct/ wrong ans
    submitQuestion = () => {
        const {currentScore, selectedAns, currentQuestion} = this.state;
        const {answer} = currentQuestion;
        let score = currentScore;
        if (selectedAns === answer) score = score + 1;
        this.setState({
            selected: false,
            submitted: true,
            currentScore: score
        });
    };

    // move to next question
    nextQuestion = () => {
        const {currentQuestionNo, questions} = this.state;
        let nextQuestionNo = currentQuestionNo + 1;
        if (nextQuestionNo > questions.length) {
            this.finishExercise();
        } else {
            const nextQuestion = questions[nextQuestionNo - 1];
            let finish = false;
            if (nextQuestionNo === questions.length) finish = true;
            this.setState({
                ...this.state,
                currentQuestionNo: nextQuestionNo,
                submitted: false,
                selected: false,
                selectedAns: {type:'', data: ''},
                finish: finish,
                currentQuestion: {
                    id: nextQuestion.id,
                    question: nextQuestion.question,
                    answer: nextQuestion.answer,
                }
            },()=>{
                this.jsPlumbInstance.setDraggable("question-drag", true);
                this.initDragDrop();
            })
        }

    };

    // redirect to scores screen/ edit screen
    finishExercise = () => {
        const {scores, currentScore, id, currentTime, times, noOfQuestions, goBackToEdit} = this.state;
        let exercise = this.props.location.state.exercise;

        if (goBackToEdit)
            this.props.history.push('/edit/group', {exercise: exercise});
        else {
            scores.push(currentScore);
            times.push(currentTime);
            this.props.addScoreTime(id, currentScore, currentTime);
            this.props.history.push('/scores', {
                scores: scores,
                userScore: currentScore,
                times: times,
                userTime: currentTime,
                noOfQuestions: noOfQuestions,
                exercise: exercise,
                type: "GROUP_ASSIGNMENT"
            });
        }
    };

    speak = (elem, text) => {
        let audioElem = elem;
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
        const {currentQuestion, groups} = this.state;
        const {showMedia} = this.props;
        const {id} = currentQuestion;
        
        let groupOptions = groups.map((group, index) => {
            let groupElement;
            if(group.type === this.multimedia.text)
                groupElement = <span>{group.data}</span>
            if(group.type === this.multimedia.image)
                groupElement = (
                    <div className = "matching-questions">
                        <img src = {group.data}
                        className = "matching-questions"                      
                        onClick = {()=>{showMedia(group.data)}}
                        alt="Question"/>
                    </div>
                )
            return(
                <div className = {`group-options col-md-${12/groups.length}`}
                    id={`group-${index+1}`}
                    key={`group-${index+1}`}>
                    {groupElement}
                </div> 
            )
        });
 
        let questionElement;
        let questionType = currentQuestion.question.type; 
        if( questionType === this.multimedia.text)
            questionElement = (
                <p style={{paddingTop:'40px'}}>{currentQuestion.question.data}</p>
            );
        if( questionType === this.multimedia.image)
            questionElement = (
                <img src = {currentQuestion.question.data}
                    className = "matching-questions"                      
                    onClick = {()=>{showMedia(currentQuestion.question.data)}}
                    alt="Question"/>
            );
        if( questionType === this.multimedia.audio)
            questionElement = (
                <audio 
                    className = "matching-questions"
                    src={currentQuestion.question.data} controls>
                </audio>
            );
        if( questionType === this.multimedia.textToSpeech) {
            questionElement = (
                <img className="button-off matching-questions"
                    onClick={(e)=>{this.speak(e.target, currentQuestion.question.data)}}
                    alt="text-to-speech-question"
                />
            );
        }
        if( questionType === this.multimedia.video)
            questionElement = (
                <video src={currentQuestion.question.data} controls
                        onClick={()=>{showMedia(currentQuestion.question.data, this.multimedia.video)}}
                    className = "matching-questions">  
                </video>
            );
        let btnClass;
        if(this.state.submitted){
            if(this.state.selectedAns === currentQuestion.answer)
                btnClass = 'correct-group';
            else  
                btnClass = 'wrong-group';
            this.jsPlumbInstance.setDraggable("question-drag", false);
        }
        let question = (
            <div name={id} id="question-drag"
                className={`before-drag box ${btnClass}`}
                answer = {currentQuestion.answer}
                >
                {questionElement}
            </div>
        )

        let buttonText = <FormattedMessage id={SUBMIT_QUESTION}/>;
        if (this.state.submitted) {
            buttonText = <FormattedMessage id={NEXT_QUESTION}/>;
            if (this.state.finish) buttonText = <FormattedMessage id={FINISH_EXERCISE}/>;
        }

        return (
            <div className="container group-container">
                <div className="row align-items-center justify-content-center">
                    <div className="col-sm-10">
                        <div className="col-md-12">
                            <div className="jumbotron">
                                <p className="lead">{this.state.title}</p>
                                <hr className="my-4"/>
                                <div className="drag-drop"
                                    style={{position:"relative"}}>
                                    {groupOptions}
                                    {question}
                                </div>
                            </div>
                            <div className="d-flex flex-row-reverse">
                                <div className="justify-content-end">
                                    <button
                                        onClick={() => {
                                            if (this.state.selected) this.submitQuestion();
                                            else if (this.state.submitted) this.nextQuestion();
                                        }}
                                        className={"btn next-button"}
                                        disabled={!this.state.selected && !this.state.submitted}
                                    >
                                        {buttonText}
                                    </button>
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
    return {}
}

export default withMultimedia(require('../../images/mcq_image.svg'))(withRouter(
    connect(MapStateToProps, {addScoreTime})(GroupAssignmentPlayer)));