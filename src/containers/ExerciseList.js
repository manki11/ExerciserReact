import React, {Component} from 'react';
import Exercise from '../components/Exercise';
import {removeExercises, editExercise} from '../store/actions/exercises';
import {addSharedExercise, removeSharedExercise} from "../store/actions/presence";
import '../css/ExerciseList.css';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

class ExerciseList extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(){

    }

    onDelete = id => {
        this.props.removeExercises(id);
    };

    onEdit = id => {
        let exercise = this.props.exercises.find(x => x.id === id);
        if (exercise.type === 'MCQ') {
            this.props.history.push('/edit/mcq', {exercise: exercise})
        }
        if (exercise.type === 'CLOZE') {
            this.props.history.push('/edit/cloze', {exercise: exercise})
        }
        if (exercise.type === 'REORDER') {
            this.props.history.push('/edit/reorder', {exercise: exercise})
        }
    };

    onShare= (id, shared) => {
        let exercise = this.props.exercises.find(x => x.id === id);
        exercise= {...exercise, shared:shared};
        this.props.editExercise(exercise);

        if(shared){
            this.props.addSharedExercise(exercise)
        }else{
            this.props.removeSharedExercise(id)
        }
    };

    onPlay = id => {
        let exercise = this.props.exercises.find(x => x.id === id);
        if (exercise.type === 'MCQ') {
            this.props.history.push('/play/mcq', {exercise: exercise})
        }
        if (exercise.type === 'CLOZE') {
            this.props.history.push('/play/cloze', {exercise: exercise})
        }
        if (exercise.type === 'REORDER') {
            this.props.history.push('/play/reorder', {exercise: exercise})
        }
    };

    render() {
        const {isHost, isShared}= this.props;
        let exercises = <p>Exercise List</p>;
        if (this.props.exercises) {
            exercises = this.props.exercises.map((r, index) => (
                <div className="col-md-6 exercise-div" key={r.id}>
                    <Exercise
                        onDelete={this.onDelete}
                        onPlay={this.onPlay}
                        onEdit={this.onEdit}
                        isHost={isHost}
                        isShared={isShared}
                        onShare={this.onShare}
                        {...r}/>
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
        counter: state.exercise_counter,
        isHost: state.isHost,
        isShared: state.isShared
    }
}

export default withRouter(
    connect(MapStateToProps,
        {removeExercises, editExercise,addSharedExercise,removeSharedExercise}
    )(ExerciseList));