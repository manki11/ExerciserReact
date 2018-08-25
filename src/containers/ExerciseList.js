import React, {Component} from 'react';
import Exercise from '../components/Exercise';
import {removeExercises, editExercise} from '../store/actions/exercises';
import {addSharedExercise, removeSharedExercise} from "../store/actions/presence";
import '../css/ExerciseList.css';
import UserList from "../components/UserList"
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import UserIcon from "../components/UserIcon";

class ExerciseList extends Component {

    constructor(props) {
        super(props);
        this.state={
            menuOpen: false
        }
    }

    handleStateChange = (state) => {
        this.setState({menuOpen: state.isOpen})
    };

    toggleMenu = () => {
        this.setState({menuOpen: !this.state.menuOpen})
    };

    componentDidMount() {
        var main = document.getElementsByClassName("main-container")[0];
        main.classList.remove("list-background", "template-background", "score-background", "pscore-background", "mcq-play-background", "mcq-form-background", "cloze-play-background", "cloze-form-background", "reorder-play-background", "reorder-form-background");
        main.classList.add("list-background");
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

    presenceResult = id => {
        let exercise = this.props.shared_exercises.find(x => x.id === id);
        this.props.history.push('/presence/scores', {exercise: exercise})
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
                        presenceResult={this.presenceResult}
                        {...r}/>
                </div>
            ))
        }

        let stroke = "#000000";
        let fill = "#FFFFFF";

        if (current_user.colorvalue) {
            stroke = current_user.colorvalue.stroke;
            fill = current_user.colorvalue.fill;
        }

        let userIcon="";

        if (this.props.isShared && this.props.isHost) {

            userList = users.map((user, index) => {
                return (
                    <div className="user-list col-sm-12 row" key={index}>
                        <div className="user-icon col-sm-4">
                            <UserIcon
                                width="60%"
                                height="80%"
                                stroke_color={user.colorvalue.stroke}
                                fill_color={user.colorvalue.fill}/>
                        </div>
                        <div className="user-text col-sm-8">
                            {user.name}
                        </div>
                    </div>
                )
            });

            userIcon = (
                <div className="user-container">
                    <button className="user-list-button" onClick={() => this.toggleMenu()}/>
                    <span className="badge badge-notify">{users.length}</span>
                </div>
            );

            userAdmin = (
                <div>
                    <UserList
                        isOpen={this.state.menuOpen}
                        onStateChange={(state) => this.handleStateChange(state)}
                        userList={userList}
                        stroke={stroke}
                        fill={fill}
                    />
                </div>
            )
        }

        return (
            <div className="home-container">
                {userIcon}
                {userAdmin}
                <div className="exercise-list-container">
                    <div className="col-md-10 mx-auto">
                        {exercises}
                    </div>
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
        shared_exercises: state.shared_exercises,
        users: state.users,
        current_user: state.current_user
    }
}

export default withRouter(
    connect(MapStateToProps,
        {removeExercises, editExercise, addSharedExercise, removeSharedExercise}
    )(ExerciseList));
