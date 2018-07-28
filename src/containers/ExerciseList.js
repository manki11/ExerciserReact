import React, {Component} from 'react';
import Exercise from '../components/Exercise';
import {removeExercises, editExercise} from '../store/actions/exercises';
import {addSharedExercise, removeSharedExercise} from "../store/actions/presence";
import '../css/ExerciseList.css';
import ReactTooltip from "react-tooltip"
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

class ExerciseList extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    componentWillReceiveProps() {
        if (this.props.isShared && this.props.isHost) {
            this.props.onUpdate();
        }
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

    onShare = (id, shared) => {
        let exercise = this.props.exercises.find(x => x.id === id);
        exercise = {...exercise, shared: shared};
        this.props.editExercise(exercise);

        if (shared) {
            this.props.addSharedExercise(exercise);
        } else {
            this.props.removeSharedExercise(id);
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
        const {isHost, isShared, users} = this.props;
        let exercises = <p>Exercise List</p>;
        let userList = "";
        let userAdmin = "";
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

        if (this.props.isShared && this.props.isHost) {
            console.log(users);
            
            userList = users.map((user, index) => (
                <p key={index}>{user}</p>
            ));

            userAdmin = (
                <div>
                    <div className="user-container">
                        <button data-tip data-for="users" className="user"/>
                        <span className="badge badge-notify">{users.length}</span>
                    </div>
                    <ReactTooltip id="users" place="bottom" type="dark" effect="solid">
                        {userList}
                    </ReactTooltip>
                </div>
            )
        }

        return (
            <div className="container">
                {userAdmin}
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
        isShared: state.isShared,
        exercises: state.exercises,
        users: state.users
    }
}

export default withRouter(
    connect(MapStateToProps,
        {removeExercises, editExercise, addSharedExercise, removeSharedExercise}
    )(ExerciseList));