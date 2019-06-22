import React, {Component} from 'react'
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {addScoreTime} from '../../store/actions/exercises';
import {SUBMIT_QUESTION, FINISH_EXERCISE} from "../translation";
import {FormattedMessage} from 'react-intl';
import DragList from "../../components/DragList";
import "../../css/REORDERPlayer.css"
import meSpeak from 'mespeak';
import withMultimedia from '../../components/WithMultimedia';

class REORDERPlayer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            id: -1,
            title: '',
            question: {
                type: '',
                data: ''
            },
            list: [],
            userAns: [],
            checkAns: [],
            submitted: false,
            scores: [],
            score: 0,
            goBackToEdit: false,
            times: [],
            userLanguage: '',
            currentTime: 0,
            intervalID: -1,
        }

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
            const {id, title, question, scores, times, list, userLanguage } = this.props.location.state.exercise;

            let goBackToEdit = false;
            if (this.props.location.state.edit) goBackToEdit = true;

            let userAns = this.shuffleArray(list.slice());

            let checkAns = list.map(() => false);

            this.setState({
                ...this.state,
                id: id,
                title: title,
                question: question,
                scores: scores,
                times: times,
                list: list,
                userAns: userAns,
                goBackToEdit: goBackToEdit,
                intervalId: intervalId,
                checkAns: checkAns,
                userLanguage: userLanguage
            }, () => {
                if(userLanguage.startsWith('en'))
                    meSpeak.loadVoice(require(`mespeak/voices/en/${this.state.userLanguage}.json`));
                else
                    meSpeak.loadVoice(require(`mespeak/voices/${this.state.userLanguage}.json`));
            })
        }
    }

    timer = () => {
        this.setState({currentTime: this.state.currentTime + 1});
    };

    componentWillUnmount() {
        clearInterval(this.state.intervalID);
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // eslint-disable-line no-param-reassign
        }
        return array;
    }

    onListChange = (list) => {
        let newlist = list.map((li, i) => {
            return {type: li.content.props.type, data: li.content.props.data}
        });
        this.setState({
            ...this.state,
            userAns: newlist
        });

    };

    // submit the exercise ( calculate score and time ) show correct/ wrong ans
    submitExercise = () => {
        const {userAns, list} = this.state;
        let checkAns = [];
        let score = 0;
        for (let i = 0; i < list.length; i++) {
            if (list[i].data.toLowerCase() === userAns[i].data.toLowerCase()) {
                checkAns.push(true);
                score++;
            } else {
                checkAns.push(false)
            }
        }

        this.setState({
            ...this.state,
            submitted: true,
            checkAns: checkAns,
            score: score
        })
    };

    // redirect to scores screen/ edit screen
    finishExercise = () => {
        const {scores, score, id, currentTime, times, list, goBackToEdit} = this.state;
        let exercise = this.props.location.state.exercise;
        let noOfQuestions = list.length;

        if (goBackToEdit)
            this.props.history.push('/edit/reorder', {exercise: exercise});
        else {
            scores.push(score);
            times.push(currentTime);
            this.props.addScoreTime(id, score, currentTime);
            this.props.history.push('/scores', {
                scores: scores,
                userScore: score,
                times: times,
                userTime: currentTime,
                noOfQuestions: noOfQuestions,
                exercise: exercise,
                type: "REORDER"
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
        const {showMedia} = this.props;
        const {checkAns, userAns} = this.state;

        let buttonText = <FormattedMessage id={SUBMIT_QUESTION}/>;
        if (this.state.submitted) buttonText = <FormattedMessage id={FINISH_EXERCISE}/>;

        let question;
        let questionType = this.state.question.type; 
        if( questionType === this.multimedia.text)
            question = (
               <p>{this.state.question.data}</p>
            );
        if( questionType === this.multimedia.image)
            question = (
                <div>
                    <p style = {{textAlign: 'center'}}>
                        <img src = {this.state.question.data}
                            style = {{height: '200px'}}
                            onClick = {()=>{showMedia(this.state.question.data)}}
                            alt="Question"/>
                    </p>
                </div>
            );
        if( questionType === this.multimedia.audio)
            question = (
                <div>
                    <p style = {{textAlign: 'center'}}>
                        <audio src={this.state.question.data} controls>
                        </audio>
                    </p>
                </div>
                
            );
        if( questionType === this.multimedia.textToSpeech) {
            question = (
                <div>
                    <span style={{marginLeft: '10px'}}>
                        <img className="button-off"
                            onClick={(e)=>{this.speak(e.target, this.state.question.data)}}
                            alt="text-to-speech-question"
                        />
                    </span>
                </div>
            );
        }
        if( questionType === this.multimedia.video)
            question = (
                <div>
                    <p style = {{textAlign: 'center'}}>
                        <video src={this.state.question.data} controls
                            height="250px">
                        </video>
                    </p>
                </div>
            );

        let options = userAns.map((option, i)=>{
            let optionElement;
            let optionsType = option.type;
            if( optionsType === this.multimedia.text)
                optionElement = option.data;
            if( optionsType === this.multimedia.image)
                optionElement = (
                    <img src = {option.data}
                            style = {{height: '100px'}}
                            onClick = {()=>{showMedia(option.data)}}
                            alt="Option"/>
                );
            if( optionsType === this.multimedia.audio)
                optionElement = (
                    <audio  className="audio-option"
                            src={option.data}
                            style={{width: '-webkit-fill-available'}}
                            controls>
                    </audio>
                );
            if( optionsType === this.multimedia.textToSpeech) {
                optionElement = (
                    <img className="button-off"
                        alt="text-to-speech-option"
                    />
                );
            }
            if( optionsType === this.multimedia.video)
                optionElement = (
                    <video  src={option.data} controls
                            height="100px">
                    </video>
                );
            return (
                <div type={option.type} data={option.data}
                    id={`answer-${i}`}
                    onClick={(e) => {
                        if( optionsType === this.multimedia.textToSpeech) {
                            let elem = e.target;
                            if(e.target.getAttribute("id"))
                                elem = e.target.children[0];
                            this.speak(elem, option.data);
                        }
                    }}
                >
                    {optionElement}
                </div>
            );
        })


        let list = (<DragList list={options} onChange={this.onListChange}/>);
        
        if (this.state.submitted) {
            list = checkAns.map((bool, i) => {
                let className = 'btn-danger';
                if (bool) className = 'btn-success';
                return (
                    <div className={"list-item " + className} key={`list-item${i}`}>
                        {options[i]}
                    </div>
                )
            });
        }

        return (
            <div className="container">
                <div className="container-fluid">
                    <div className="row align-items-center justify-content-center">
                        <div className="col-sm-10">
                            <div className="jumbotron">
                                <p className="lead">{this.state.title}</p>
                                <hr className="my-4"/>
                                {question}
                                <div>
                                    {list}
                                </div>
                            </div>
                            <div className="d-flex flex-row-reverse">
                                <div className="justify-content-end">
                                    <button
                                        onClick={() => {
                                            if (this.state.submitted) this.finishExercise();
                                            else this.submitExercise();
                                        }}
                                        className={"btn next-button"}
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

export default withMultimedia(require('../../images/list_reorder_image.svg'))(withRouter(
    connect(MapStateToProps, {addScoreTime})(REORDERPlayer)));