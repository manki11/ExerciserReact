import React, {Component} from 'react';
import Exercise from '../components/Exercise';
import {removeExercises, editExercise} from '../store/actions/exercises';
import {addSharedExercise, removeSharedExercise} from "../store/actions/presence";
import '../css/ExerciseList.css';
import ReactTooltip from "react-tooltip"
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import UserIcon from "../components/UserIcon";

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
        const {isHost, isShared, users, current_user} = this.props;
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

            userList = users.map((user, index) => {
                console.log(user);
                
                return (
                    <div className="user-list col-sm-12 row" key={index}>
                    <span className="user-icon col-sm-4">
                        <UserIcon
                            width="90%"
                            height="90%"
                            stroke_color={user.colorvalue.stroke}
                            fill_color={user.colorvalue.fill}/>
                    </span>
                        <span className="user-text col-sm-8">
                        {user.name}
                    </span>
                    </div>
                )
            });

            let stroke = "#000000";
            let fill = "#FFFFFF";

            console.log(current_user);
            if (current_user) {
                stroke = current_user.colorvalue.stroke;
                fill = current_user.colorvalue.fill;
                console.log(stroke);
            }

            userAdmin = (
                <div>
                    <div className="user-container">
                        <button data-tip data-for="users" data-event='click' className="user">
                            <UserIcon
                                width="100%"
                                height="100%"
                                stroke_color={stroke}
                                fill_color={fill}/>
                        </button>
                        <span className="badge badge-notify">{users.length}</span>
                    </div>
                    <ReactTooltip className="tooltip-react" id="users" place="bottom" type="dark" effect="solid">
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
        )
            ;
    }
}

function MapStateToProps(state) {
    return {
        counter: state.exercise_counter,
        isHost: state.isHost,
        isShared: state.isShared,
        exercises: state.exercises,
        users: state.users,
        current_user: state.current_user
    }
}

export default withRouter(
    connect(MapStateToProps,
        {removeExercises, editExercise, addSharedExercise, removeSharedExercise}
    )(ExerciseList));