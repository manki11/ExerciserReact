import React from "react";
import {Switch, Route, withRouter, Redirect} from "react-router-dom";
import {connect} from "react-redux";
import ExerciseList from "./ExerciseList";
import Scores from "./Scores/Scores"

import MCQForm from "./Builders/MCQForm";
import MCQPlay from "./Players/MCQPlayer";

import NewExerciseTemplate from "./Builders/Template";

const Main= props=> {
    const {exercises}= props;

    return(
        <div className="container">
            <Switch>
                <Route exact path="/" render={props=> <ExerciseList exercises={exercises} {...props}/>}/>
                <Route exact path="/new" render={props=> <NewExerciseTemplate/>} {...props}/>
                <Route exact path="/scores" render={props=> <Scores/>} {...props}/>

                // MCQ
                <Route exact path="/new/mcq" render={props=> <MCQForm/>} {...props}/>
                <Route exact path="/edit/mcq" render={props=> <MCQForm/>} {...props}/>
                <Route exact path="/play/mcq" render={props=> <MCQPlay/>} {...props}/>
            </Switch>
        </div>
    )
};

function MapStateToProps(state) {
    return {
        exercises: state.exercises,
    }
}

export default withRouter(connect(MapStateToProps)(Main));