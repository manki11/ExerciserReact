import React, {Component} from 'react';
import Exercise from '../components/Exercise';
import {removeExercises} from '../store/actions/exercises';
import '../css/ExerciseList.css';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

class ExerciseList extends Component {

    constructor(props) {
        super(props);
    }

    onDelete = id => {
        this.props.removeExercises(id);
    };

    onEdit = id => {
        let exercise = this.props.exercises.find(x => x.id === id);
        if (exercise.type === 'MCQ') {
            this.props.history.push('/edit/mcq', {exercise: exercise})
        }
    };

    onPlay = id => {
        let exercise = this.props.exercises.find(x => x.id === id);
        if (exercise.type === 'MCQ') {
            this.props.history.push('/play/mcq', {exercise: exercise})
        }
    };


    render() {
        let exercises = <p>Exercise List</p>;
        if (this.props.exercises) {
            exercises = this.props.exercises.map((r, index) => (
                <div className="col-md-6 exercise-div" key={r.id}>
                    <Exercise onDelete={this.onDelete} onPlay={this.onPlay} onEdit={this.onEdit} {...r}/>
                </div>
            ))
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