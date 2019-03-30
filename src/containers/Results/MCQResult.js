import React, {Component} from "react"
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import "../../css/MCQPlayer.css"

class MCQResult extends Component {
    constructor(props) {
        super(props)
    }

    back = ()=> {
        const {userScore, userTime, noOfQuestions, exercise, scoreSheet, isPresence} = this.props.location.state;

        if(isPresence){
            this.props.history.push('/presence/scores', {
                exercise: exercise,
            })
        }else {
            this.props.history.push('/scores', {
                userScore: userScore,
                userTime: userTime,
                noOfQuestions: noOfQuestions,
                exercise: exercise,
                add: false,
                scoreSheet: scoreSheet,
                type: "MCQ"
            });
        }
    };

    render() {
        let {scoreSheet, exercise} = this.props.location.state;

        let questions = scoreSheet.map((question, i) => {

            let image = '';
            if (question.isImage) {
                const {src, height, width} = question.image;
                image = <img className="img-thumbnail img-fluid"
                             style={{width: width, height: height, margin: '0 auto', display: 'block'}}
                             src={src}/>
            }

            let choices = question.answers.map((ans, i) => {
                let btn = 'btn-outline-secondary';
                if (question.selectedAns === ans) {
                    btn = 'btn-secondary'
                }
                if (question.selectedAns === question.correctAns) {
                    if (ans === question.selectedAns) {
                        btn = 'btn-success';
                    }
                } else {
                    if (ans === question.correctAns) {
                        btn = 'btn-success';
                    }
                    if (question.selectedAns === ans) {
                        btn = 'btn-danger';
                    }
                }

                return (
                    <div className="choices-row" key={`answers-${i}`}>
                        <div className="col-md-4 choices-div">
                            <button
                                className={"btn choices-button " + btn}
                                id={`answer-${i}`}
                            >{ans}</button>
                        </div>
                    </div>
                )
            });


            return (
                <div className="container-fluid" key={`question-${i}`} style={{marginBottom:"20px"}}>
                    <div>
                        <p style={{fontSize:"20px"}}>{i+1}. {question.question}</p>
                        <div className="row">
                            {image}
                        </div>
                        {choices}
                    </div>
                </div>
            )
        });


        return (
            <div className="container mcq-container" style={{marginBottom:"20px"}}>
                <div className="row align-items-center justify-content-center">
                    <div className="col-sm-10">
                        <div className="col-md-12">
                            <div className="jumbotron" style={{padding: "30px"}}>
                                <p className="lead" style={{fontSize:"30px"}}>{exercise.title}</p>
                                {questions}
                            </div>
                            <button
                                onClick={this.back}
                                className={"btn button-previous"}
                            >Back</button>
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
    connect(MapStateToProps)(MCQResult));