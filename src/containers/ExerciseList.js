import React, { Component } from "react";
import { removeExercises, editExercise } from "../store/actions/exercises";
import {
	addSharedExercise,
	removeSharedExercise,
} from "../store/actions/presence";
import {
	setRunAllExercise,
	setExerciseIndex,
} from "../store/actions/sugarizer";
import { addEvaluationExercise } from "../store/actions/evaluation";
import "../css/ExerciseList.css";
import UserList from "../components/UserList";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import UserIcon from "../components/UserIcon";
import ExerciseDragList from "../components/ExerciseListItem.js";
import Exercise from "../components/Exercise";

class ExerciseList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			menuOpen: false,
			exercises: [],
		};
	}

	handleStateChange = (state) => {
		this.setState({ menuOpen: state.isOpen });
	};

	toggleMenu = () => {
		this.setState({ menuOpen: !this.state.menuOpen });
	};

	componentWillReceiveProps() {
		this.setState({ exercises: this.props.exercises });
		if (this.props.isShared && this.props.isHost) {
			this.props.onUpdate();
		}
	}

	onDelete = (id) => {
		this.props.removeExercises(id);
	};

	onEdit = (id) => {
		let exercise = this.props.exercises.find((x) => x.id === id);
		if (exercise.type === "MCQ") {
			this.props.history.push("/edit/mcq", { exercise: exercise });
		}
		if (exercise.type === "CLOZE") {
			this.props.history.push("/edit/cloze", { exercise: exercise });
		}
		if (exercise.type === "REORDER") {
			this.props.history.push("/edit/reorder", { exercise: exercise });
		}
		if (exercise.type === "GROUP_ASSIGNMENT") {
			this.props.history.push("/edit/group", { exercise: exercise });
		}
		if (exercise.type === "FREE_TEXT_INPUT") {
			this.props.history.push("/edit/freeText", { exercise: exercise });
		}
		if (exercise.type === "MATCHING_PAIR") {
			this.props.history.push("/edit/match", { exercise: exercise });
		}
	};

	onShare = (id, shared) => {
		if (!this.props.isShared) {
			document.getElementById("shared-button").click();
		}

		let exercise = this.props.exercises.find((x) => x.id === id);
		exercise = { ...exercise, shared: shared };
		exercise["run_all"] = false;
		this.props.editExercise(exercise);
		console.log(exercise, "abcd");
		if (shared) {
			this.props.addSharedExercise(exercise);
		} else {
			this.props.removeSharedExercise(id);
		}
	};

	onPlay = (id) => {
		let exercise = this.props.exercises.find((x) => x.id === id);
		this.props.setRunAllExercise(false);
		if (
			this.props.isShared &&
			!this.props.isHost &&
			this.props.shared_exercises.allow_run_all
		) {
			if (!this.props.isRunAll) {
				this.props.setRunAllExercise(true);
				this.props.setExerciseIndex(0);
				exercise = this.props.exercises[0];
			} else {
				exercise = this.props.exercises[this.props.exercise_running + 1];
			}
		}
		if (this.props.evaluation_mode === "async") {
			if (!this.props.evaluationExercise.find((x) => x.id === exercise.id)) {
				this.props.addEvaluationExercise(exercise);
			}
		}
		if (exercise.type === "MCQ") {
			this.props.history.push("/play/mcq", { exercise: exercise });
		}
		if (exercise.type === "CLOZE") {
			this.props.history.push("/play/cloze", { exercise: exercise });
		}
		if (exercise.type === "REORDER") {
			this.props.history.push("/play/reorder", { exercise: exercise });
		}
		if (exercise.type === "GROUP_ASSIGNMENT") {
			this.props.history.push("/play/group", { exercise: exercise });
		}
		if (exercise.type === "FREE_TEXT_INPUT") {
			this.props.history.push("/play/freeText", { exercise: exercise });
		}
		if (exercise.type === "MATCHING_PAIR") {
			this.props.history.push("/play/match", { exercise: exercise });
		}
	};

	presenceResult = (id) => {
		console.log(this.props, id, "abcd");
		let exercise = this.props.shared_exercises.find((x) => x.id === id);
		this.props.history.push("/presence/scores", { exercise: exercise });
	};

	reorderExercise = (list) => {
		this.props.setExercise(list);
	};

	render() {
		const { isHost, isShared, users, current_user } = this.props;
		let exercises = <p>Exercise List</p>;
		let userList = "";
		let userAdmin = "";
		if (this.props.exercises) {
			const dragListItemProps = {
				isHost,
				isShared,
				onDelete: this.onDelete,
				onPlay: this.onPlay,
				onEdit: this.onEdit,
				onShare: this.onShare,
				presenceResult: this.presenceResult,
				inEditMode: this.props.inEditMode,
			};
			if (this.props.inEditMode) {
				exercises = (
					<ExerciseDragList
						list={this.props.exercises}
						updateExercises={this.reorderExercise}
						{...dragListItemProps}
					/>
				);
			} else {
				exercises = this.props.exercises.map((r, index) => (
					<div className='col-md-6 exercise-div' key={r.id}>
						<Exercise
							onDelete={this.onDelete}
							onPlay={this.onPlay}
							onEdit={this.onEdit}
							isHost={isHost}
							isShared={isShared}
							onShare={this.onShare}
							presenceResult={this.presenceResult}
							inEditMode={this.props.inEditMode}
							isFirst={index === 0}
							run_all_share={
								this.props.shared_exercises.allow_run_all || r.run_all
							}
							allowEvaluation={
								this.props.evaluationExercise.find((x) => x.id === r.id) &&
								this.props.evaluationExercise.find((x) => x.id === r.id).id > 0
							}
							{...r}
						/>
					</div>
				));
			}
		}

		let stroke = "#000000";
		let fill = "#FFFFFF";

		if (current_user.colorvalue) {
			stroke = current_user.colorvalue.stroke;
			fill = current_user.colorvalue.fill;
		}
		let styles = { backgroundColor: fill };

		let userIcon = "";

		if (this.props.isShared && this.props.isHost) {
			userList = users.map((user, index) => {
				return (
					<div className='user-list col-sm-12 row' key={index}>
						<div className='user-icon col-sm-4'>
							<UserIcon
								width='60%'
								height='80%'
								stroke_color={user.colorvalue.stroke}
								fill_color={user.colorvalue.fill}
							/>
						</div>
						<div className='user-text col-sm-8'>{user.name}</div>
					</div>
				);
			});

			userIcon = (
				<div className='user-container'>
					<button
						className='user-list-button'
						onClick={() => this.toggleMenu()}
					/>
					<span className='badge badge-notify'>{users.length}</span>
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
			);
		}

		return (
			<div className='home-container' style={styles}>
				{userIcon}
				{userAdmin}
				<div
					className={
						"exercise-list-container" +
						(this.props.inFullscreenMode ? " Exercise-List-NoPadding" : "")
					}
				>
					<div
						className={
							"col-md-10 mx-auto" +
							(this.props.inFullscreenMode ? " Exercise-List-NoPadding" : "")
						}
					>
						{exercises}
					</div>
				</div>
			</div>
		);
	}
}

function MapStateToProps(state) {
	return {
		counter: state.exercise_counter,
		isHost: state.isHost,
		isRunAll: state.isRunAll,
		isShared: state.isShared,
		exercises: state.exercises,
		shared_exercises: state.shared_exercises,
		users: state.users,
		current_user: state.current_user,
		evaluation_mode: state.evaluation_mode,
		evaluationExercise: state.evaluation_exercise,
	};
}

export default withRouter(
	connect(MapStateToProps, {
		removeExercises,
		editExercise,
		addSharedExercise,
		removeSharedExercise,
		setRunAllExercise,
		setExerciseIndex,
		addEvaluationExercise,
	})(ExerciseList)
);
