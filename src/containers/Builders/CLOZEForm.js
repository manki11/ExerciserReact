import React, {Component} from "react";
import {connect} from "react-redux";
import {addNewExerciseQuestion} from "../../store/actions/new_exercise";
import {incrementExerciseCounter} from "../../store/actions/increment_counter";
import {addNewExercise, editExercise} from "../../store/actions/exercises";
import {FormattedMessage} from 'react-intl';
import {withRouter} from "react-router-dom"
import "../../css/CLOZEForm.css"

class CLOZEForm extends Component{

    constructor(props){
        super(props);

        this.state = {
            edit:false,
            id:-1,
            title: '',
            question: '',
            clozetext:'',
            scores:[],
            isFormValid: false,
            answers: [''],
            errors: {
                question: false,
                answers: false,
                title: false
            }
        };
    }

    render(){
        return(
            <div>
                CLOZE FORM
            </div>
        )
    }
}

function MapStateToProps(state) {
    return {
        counter: state.exercise_counter
    }
}

export default withRouter(
    connect(MapStateToProps,
        {addNewExerciseQuestion, addNewExercise, incrementExerciseCounter, editExercise}
    )(CLOZEForm));