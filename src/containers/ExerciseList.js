import React, {Component} from 'react';
import Exercise from '../components/Exercise';
import {removeExercises} from '../store/actions/exercises';
import '../css/ExerciseList.css';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

class ExerciseList extends Component {

    constructor(props){
        super(props);
    }

    onDelete=id=>{
        this.props.removeExercises(id);
    };

    onEdit=id=>{
        let exercise= this.props.exercises.find(x => x.id === id);
        if(exercise.type==='MCQ') {
            // this.props.history.push({
            //     pathname: '/edit/mcq',
            //     state: {exercise: exercise}
            // })
            this.props.history.push('/edit/mcq', {exercise:exercise})
        }
    };

    onPlay= id=>{

    };

    render() {
        let exercises = <p>Exercise List</p>;
        if (this.props.exercises) {
            exercises = this.props.exercises.map((r, index) => (
                <Exercise onDelete={this.onDelete} onPlay={this.onPlay} onEdit={this.onEdit} key={r.id} {...r}/>));
        }

        return (
            <div className="container">
                <div className="col-md-12">
                {exercises}
                </div>
            </div>
        );
    }
}

function MapStateToProps(state) {
    return {
        counter: state.exercise_counter
    }
}

export default withRouter(
    connect(MapStateToProps,
        {removeExercises}
    )(ExerciseList));