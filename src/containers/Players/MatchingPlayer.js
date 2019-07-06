import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {addScoreTime} from '../../store/actions/exercises';
import "../../css/MatchingPlayer.css";
import {SUBMIT_QUESTION, FINISH_EXERCISE} from "../translation";
import {FormattedMessage} from 'react-intl';
import {jsPlumb} from 'jsplumb';
import meSpeak from 'mespeak';
import withMultimedia from '../../components/WithMultimedia';

class MATCHING_PAIRPLAYER extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: -1,
            title: '',
            noOfPairs: 1,
            pairs: [],
            questions: [],
            answers: [],
            submitted: false,
            selected: false,
            selectedConnections: [],
            score: 0,
            scores: [],
            times: [],
            currentTime: 0,
            intervalID: -1,
            goBackToEdit: false,
            connections: [],
            userAnswers:[],
        }

        this.multimedia = {
            text: 'text',
            image: 'image',
            audio: 'audio',
            textToSpeech: 'text-to-speech',
            video: 'video'
        };

        this.instance = jsPlumb.getInstance();
    }

    // load the exercise from props
    componentDidMount() {
        if (this.props.location.state) {
            let intervalId = setInterval(this.timer, 1000);
            const {id, title, pairs, scores, times, userLanguage} = this.props.location.state.exercise;

            let goBackToEdit = false;
            if (this.props.location.state.edit) goBackToEdit = true;

            let answers = pairs.map((pair)=>{
                return pair.answer;
            });
            this.shuffleArray(answers);

            let questions = pairs.map((pair)=>{
                return pair.question;
            });

            this.setState({
                ...this.state,
                id: id,
                title: title,
                noOfPairs: pairs.length,
                pairs: pairs,
                intervalID: intervalId,
                scores: scores,
                times: times,
                goBackToEdit: goBackToEdit,
                questions: questions,
                answers: answers,
                userLanguage: userLanguage
            }, ()=>{
                this.initMatchingPairConnectable();
                if(userLanguage.startsWith('en'))
                    meSpeak.loadVoice(require(`mespeak/voices/en/${this.state.userLanguage}.json`));
                else
                    meSpeak.loadVoice(require(`mespeak/voices/${this.state.userLanguage}.json`));
            })
        }
    }

    initMatchingPairConnectable = () =>{
    
        this.instance.batch(() => {
            this.instance.bind("connection", (info, originalEvent) => {
                this.updateConnections(info.connection);
            });
            this.instance.bind("connectionDetached", (info, originalEvent) => {
                this.updateConnections(info.connection, true);
            });
            this.instance.bind("connectionMoved", (info, originalEvent) => {
                this.updateConnections(info.connection, true);
            });

            // configure some drop options for use by all endpoints.
            var dropOptions = {
                tolerance: "touch",
                hoverClass: "dropHover",
                activeClass: "dragActive"
            };

            var color = "rgb(128, 128, 128)";
            var dragDropEndPoints = {
                // enabled: false,
                dragDropEndPoints: ["Dot", {radius: 10} ],
                paintStyle: { fill: color, opacity: 1.0 },
                isSource: true,
                scope: 'grey',
                connectorStyle: {
                    stroke: color,
                    strokeWidth: 4
                },
                connector: "Straight",
                isTarget: true,
                dropOptions: dropOptions,
                beforeDrop: (params) => {
                    let source = params.sourceId.split('-')[0];
                    let target = params.targetId.split('-')[0]; 
                    if(source === 'answer')
                        return false;
                    if(source === target)
                        return false;
                    return true;
                }
            };
            this.instance.addEndpoint(document.getElementsByClassName("question"), { anchor: "RightMiddle" }, dragDropEndPoints);
            this.instance.addEndpoint(document.getElementsByClassName("answer"), { anchor: "LeftMiddle" }, dragDropEndPoints);
        });
    }

    updateConnections = (conn, remove) => {
        let {connections} = this.state;

        if (!remove) connections.push(conn);
        else {
            var idx = -1;
            for (var i = 0; i < connections.length; i++) {
                if (connections[i] === conn) {
                    idx = i;
                    break;
                }
            }
            if (idx !== -1) connections.splice(idx, 1);
        }

        this.setState({
            ...this.state,
            connections: connections
        }, ()=>{
            this.updateResults();
        })
    };

    updateResults=()=>{
        let {connections, userAnswers} = this.state;
        let selected = false;
        if(connections.length === this.state.questions.length && !this.state.submitted)
            selected = true;
        
        connections.forEach((connection)=>{
            let index = connection.sourceId.split('-').pop();
            userAnswers[index] = connection.targetId.split('-').pop();
        })
        
        this.setState({
            ...this.state,
            selected: selected,
            userAnswers: userAnswers
        })
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalID);
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // eslint-disable-line no-param-reassign
        }
    }

    // to measure time
    timer = () => {
        this.setState({currentTime: this.state.currentTime + 1});
    };

    // submit the exercise ( calculate score and time ) show correct/ wrong ans
    submitQuestion = () => {
        let {score, userAnswers, pairs} = this.state;
        this.instance.deleteEveryEndpoint();
       
        pairs.forEach((pair)=>{
            let ansToCheck = this.state.answers[userAnswers[pair.id]-1];
            let source = document.getElementById(`question-${pair.id}`);
            let target = document.getElementById(`answer-display-${userAnswers[pair.id]}`);

            if( ansToCheck.data === pair.answer.data){
                score += 1;
                source.style.backgroundColor = 'green';
                target.style.backgroundColor = 'green';

            } else{
                source.style.backgroundColor = 'red';
                target.style.backgroundColor = 'red';
            }

            this.instance.connect({
                source: source,
                target: target,
                anchors: ["RightMiddle", "LeftMiddle"],
                connector: "Straight",
                endpoint:"Dot",
                endpointStyle:{ fillStyle: "red"}
            })
        })

        let updatedUserAnswers = userAnswers.map((ans, index) => {
            return {
                question: pairs[index-1].question,
                correctAns: pairs[index-1].answer,
                userAns: this.state.answers[ans-1] 
            }
        });

        this.setState({
            ...this.state,
            selected: false,
            submitted: true,
            score:score,
            userAnswers: updatedUserAnswers
        })
    };

    // redirect to scores screen/ edit screen
    finishExercise = () => {
        const {scores, score, id, currentTime, times, noOfPairs, goBackToEdit, userAnswers} = this.state;
        let exercise = this.props.location.state.exercise;

        if (goBackToEdit)
            this.props.history.push('/edit/match', {exercise: exercise});
        else {
            scores.push(score);
            times.push(currentTime);
            this.props.addScoreTime(id, score, currentTime);
            this.props.history.push('/scores', {
                scores: scores,
                userScore: score,
                times: times,
                userTime: currentTime,
                noOfQuestions: noOfPairs,
                exercise: exercise,
                userAnswers: userAnswers,
                type: "MATCHING_PAIR"
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
        const {questions} =  this.state;
        const {showMedia} = this.props;

        let matchingTemplate = questions.map((ques, index) => {
            let question;
            let questionType = ques.type; 
            if( questionType === this.multimedia.text)
                question = (
                    <p style={{paddingTop:'40px'}}>{ques.data}</p>
                );
            if( questionType === this.multimedia.image)
                question = (
                    <img src = {ques.data}
                        className = "matching-questions"                      
                        onClick = {()=>{showMedia(ques.data)}}
                        alt="Question"/>
                );
            if( questionType === this.multimedia.audio)
                question = (
                    <audio 
                        className = "matching-questions"
                        src={ques.data} controls>
                    </audio>
                );
            if( questionType === this.multimedia.textToSpeech) {
                question = (
                    <img className="button-off matching-questions"
                        onClick={(e)=>{this.speak(e.target, ques.data)}}
                        alt="text-to-speech-question"
                    />
                );
            }
            if( questionType === this.multimedia.video)
                question = (
                    <video src={ques.data} controls
                            onClick={()=>{showMedia(ques.data, this.multimedia.video)}}
                        className = "matching-questions">  
                    </video>
                );

            let answer;
            let answerType = this.state.answers[index].type;
            if( answerType === this.multimedia.text)
                answer = (
                    <p style={{paddingTop:'40px'}}>
                        {this.state.answers[index].data}
                    </p>
                );
            if( answerType === this.multimedia.image)
                answer = (
                    <img src = {this.state.answers[index].data}
                        className = "matching-answers"
                        onClick = {()=>{showMedia(this.state.answers[index].data)}}
                        alt="Option"/>
                );
            if( answerType === this.multimedia.audio)
                answer = (
                    <audio  className="audio-option matching-answers"
                            src={this.state.answers[index].data}
                            controls>
                    </audio>
                );
            if( answerType === this.multimedia.textToSpeech) {
                answer = (
                    <img className="button-off matching-answers"
                        alt="text-to-speech-option"
                        onClick={(e)=>{this.speak(e.target, this.state.answers[index].data)}}
                    />
                );
            }
            if( answerType === this.multimedia.video)
                answer = (
                    <video  src={this.state.answers[index].data} controls
                        onClick={()=>{showMedia(this.state.answers[index].data, this.multimedia.video)}}
                        className = "matching-answers"> 
                    </video>
                );

            return (
                <div className="row" key={`pair-${index+1}`}>
                    <div className="col-md-3 col-sm-3 box question" id={`question-${index+1}`}>
                        {question}
                    </div>
                    <div className="col-md-3 col-sm-3 box answer" id={`answer-display-${index+1}`}>
                        {answer}
                    </div>  
                </div>
            );
        });

        let buttonText = <FormattedMessage id={SUBMIT_QUESTION}/>;
        if (this.state.submitted) {
            buttonText = <FormattedMessage id={FINISH_EXERCISE}/>;
        }

        return (
            <div className="container mcq-container">
                <div className="row align-items-center justify-content-center">
                    <div className="col-sm-10">
                        <div className="col-md-12">
                            <div className="jumbotron">
                                <p className="lead">{this.state.title}</p>
                                <hr className="my-4"/>
                                {matchingTemplate}
                            </div>
                            <div className="d-flex flex-row-reverse">
                                <div className="justify-content-end">
                                    <button
                                        onClick={() => {
                                            if (this.state.selected) this.submitQuestion();
                                            else if (this.state.submitted) this.finishExercise();
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

export default withMultimedia(require("../../images/list_reorder_image.svg"))(withRouter(
    connect(MapStateToProps, {addScoreTime})(MATCHING_PAIRPLAYER)));