import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {addScore} from '../../store/actions/exercises';
import "../../css/MCQPlayer.css"


class MCQPlayer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            title: '',
            questions: [],
            noOfQuestions: 1,
            currentQuestionNo: 1,
            submitted: false,
            selected: false,
            selectedAns:'',
            scores: [],
            currentScore:0,
            finish: false,
            currentQuestion: {
                id: 1,
                question: '',
                answers: [],
                correctAns: ''
            }
        }
    }

    componentDidMount() {
        if (this.props.location.state) {
            const {id, title, questions, scores} = this.props.location.state.exercise;
            const currentQuestion = questions[0];
            console.log(this.props.location.state.exercise);
            let finish= false;
            if(questions.length===1) finish=true;

            this.setState({
                ...this.state,
                title: title,
                questions: questions,
                noOfQuestions: questions.length,
                scores: scores,
                finish:finish,
                currentQuestion: {
                    id: currentQuestion.id,
                    question: currentQuestion.question,
                    answers: currentQuestion.answers,
                    correctAns: currentQuestion.correctAns
                }
            })
        }
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // eslint-disable-line no-param-reassign
        }
    }

    choiceSelected= choice=>{
        if(!this.state.submitted) {
            this.setState({
                selectedAns: choice,
                selected: true
            })
        }
    };

    submitQuestion= ()=>{
        const {currentScore,selectedAns, currentQuestion}= this.state;
        const {correctAns}= currentQuestion;
        let score= currentScore;
        if(selectedAns=== correctAns) score=score+1;
        this.setState({
            selected:false,
            submitted: true,
            currentScore: score
        })
    };

    nextQuestion= ()=>{
        const {currentQuestionNo, questions}= this.state;
        let nextQuestionNo= currentQuestionNo+1;
        if(nextQuestionNo>questions.length){
            this.onGameOver();
        }else{
            const nextQuestion= questions[nextQuestionNo-1];
            let answers= nextQuestion.answers;
            this.shuffleArray(answers);
            let finish= false;
            if(nextQuestionNo=== questions.length) finish=true;
            this.setState({
                ...this.state,
                currentQuestionNo: nextQuestionNo,
                submitted: false,
                selected: false,
                selectedAns:'',
                finish:finish,
                currentQuestion:{
                    id: nextQuestion.id,
                    question: nextQuestion.question,
                    answers: answers,
                    correctAns: nextQuestion.correctAns
                }
            })
        }

    };

    onGameOver=()=>{
        const {scores, currentScore, id}= this.state;
        scores.push(currentScore);
        this.props.addScore(id, currentScore);
        this.props.history.push('/scores', {scores: scores, userScore: currentScore});
    };

    render() {
        const {currentQuestion} = this.state;
        const {id} = currentQuestion;
        if(id===1 && !this.state.submitted && !this.state.selected){
            this.shuffleArray(currentQuestion.answers)
        }
        let choices = currentQuestion.answers.map((ans, i) => {
            let btn = 'btn-outline-secondary';
            if(this.state.selectedAns=== ans){
                btn= 'btn-secondary'
            }
            if (this.state.submitted) {
                if(this.state.selectedAns=== this.state.currentQuestion.correctAns){
                    if(ans===this.state.selectedAns){
                        btn='btn-success';
                    }
                }else{
                    if(ans=== this.state.currentQuestion.correctAns){
                        btn='btn-success';
                    }
                    if(this.state.selectedAns=== ans){
                        btn='btn-danger';
                    }
                }
            }
            return (
                <div className="choices-row" key={`answers-${i}`}>
                    <div className="col-md-6 choices-div">
                        <button
                            className={"btn choices-button " + btn}
                            id={`answer-${i}`}
                            onClick={(e)=>this.choiceSelected(ans)}
                        >{ans}</button>
                    </div>
                </div>
            )
        });
        let buttonText='Submit Question';
        if (this.state.submitted) {
            buttonText='Next Question';
            if (this.state.finish) buttonText='Finish Exercise'
        }

        return (
            <div className="container-fluid">
                <div className="row align-items-center justify-content-center">
                    <div className="col-sm-10">
                        <div className="col-md-12">
                            <div className="jumbotron">
                                <p className="lead">{this.state.title}</p>
                                <hr className="my-4"/>
                                <p>{id}. {this.state.currentQuestion.question}</p>
                            </div>
                            <div className="row">
                                {choices}
                            </div>
                            <div className="d-flex flex-row-reverse">
                                <div className="justify-content-end">
                                    <button
                                        onClick={()=>{
                                            if(this.state.selected) this.submitQuestion();
                                            else if (this.state.submitted) this.nextQuestion();
                                        }}
                                        className={"btn btn-success"}
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

export default withRouter(
    connect(MapStateToProps, {addScore})(MCQPlayer));