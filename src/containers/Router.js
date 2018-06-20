import React from "react";
import {Switch, Route, withRouter, Redirect} from "react-router-dom";
import {connect} from "react-redux";
import ExerciseList from "./ExerciseList";
import MCQForm from "./Builders/MCQForm";
import NewExerciseTemplate from "./Builders/NewExerciseTemplate";

const Main= props=> {
    const {exercises}= props;
    return(
        <div className="container">
            <Switch>
                <Route exact path="/" render={props=> <ExerciseList exercises={exercises} {...props}/>}/>
                <Route exact path="/new" render={props=> <NewExerciseTemplate/>} {...props}/>
                <Route exact path="/new/mcq" render={props=> <MCQForm/>} {...props}/>
                <Route exact path="/edit/mcq" render={props=> <MCQForm/>} {...props}/>
                <Route exact path="/play/mcq" render={props=> <MCQForm/>} {...props}/>
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