import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {addScoreTime} from '../../store/actions/exercises';
import "../../css/GroupAssignmentPlayer.css"
import {SUBMIT_QUESTION, NEXT_QUESTION, FINISH_EXERCISE} from "../translation";
import {FormattedMessage} from 'react-intl';
import {jsPlumb} from 'jsplumb';
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
            selectedAns: '',
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
                question: '',
                answer: '',
            }
        }
        this.jsPlumbInstance = jsPlumb.getInstance();
    }

    // load the exercise from props
    componentDidMount() {
        if (this.props.location.state) {
            let intervalId = setInterval(this.timer, 1000);
            const {id, title, questions, scores, times, groups} = this.props.location.state.exercise;
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
                currentQuestion: currentQuestion,
            },()=>{
                this.initDragDrop();
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
                selectedAns: '',
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

    render() {
        const {currentQuestion, groups} = this.state;
        const {id} = currentQuestion;

        let groupOptions = groups.map((group, index) => {
            return(
                <div className = {`group-options col-md-${12/groups.length}`}
                    id={`group-${index+1}`}
                    key={`group-${index+1}`}>
                    {group}
                </div> 
            )
        });
 
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
                className={`before-drag ${btnClass}`}
                answer = {currentQuestion.answer}
                >
                {currentQuestion.question}
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