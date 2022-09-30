import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import "../css/Navbar.css";
import { injectIntl } from "react-intl";
import { UNFULLSCREEN } from "../containers/translation";
import MainToolbar from "./MainToolbar";
import { setExerciseIndex } from "../store/actions/sugarizer";
import { setEvaluationMode } from "../store/actions/evaluation";

class Navbar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isfullScreen: false,
			showTutorial: false,
		};
	}

	// redirect to new exercise template
	directToNew = () => {
		this.props.history.push("/new");
	};

	// redirect to home screen
	directToHome = () => {
		this.props.history.push("/");
	};

	enterEditMode = () => {
		this.props.toggleEditMode(true);
	};

	exitEditMode = () => {
		this.props.toggleEditMode(false);
		this.props.history.push("/");
	};

	startTutorial = () => {
		this.setState({
			showTutorial: true,
		});
	};

	stopTutorial = () => {
		this.setState({
			showTutorial: false,
		});
	};
	goFullscreen = () => {
		this.setState({
			isfullScreen: true,
		});
	};
	gounFullScreen = () => {
		this.setState({
			isfullScreen: false,
		});
	};

	runAllExercise = () => {
		let exercise = null;
		if (this.props.evaluationMode === "") {
			if (!this.props.isRunAll) {
				this.props.runAllExercise();
				this.props.setExerciseIndex(0);
				exercise = this.props.exercises[0];
			} else {
				exercise = this.props.exercises[this.props.exercise_running + 1];
			}
		} else {
			if (!this.props.isRunAll) {
				this.props.runAllExercise();
				let index = 0;
				while (index < this.props.exercises.length) {
					if (
						this.props.evaluationExercies.find(
							(item) => item.id === this.props.exercises[index].id
						) &&
						this.props.evaluationExercies.find(
							(item) => item.id === this.props.exercises[index].id
						).evaluation
					) {
						index++;
					} else {
						break;
					}
				}
				this.props.setExerciseIndex(index);
				exercise = this.props.exercises[index];
			} else {
				let index = this.props.exercise_running;
				while (index < this.props.exercises.length) {
					if (
						this.props.evaluationExercies.find(
							(item) => item.id === this.props.exercises[index].id
						) &&
						this.props.evaluationExercies.find(
							(item) => item.id === this.props.exercises[index].id
						).evaluation
					) {
						index++;
					} else {
						break;
					}
				}
				exercise = this.props.exercises[index];
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

	shareAll = () => {
		this.props.onShareAll();
	};

	render() {
		let unFullScreen = this.props.intl.formatMessage({ id: UNFULLSCREEN });
		let navFunctions = {
			directToNew: this.directToNew,
			directToHome: this.directToHome,
			enterEditMode: this.enterEditMode,
			exitEditMode: this.exitEditMode,
			startTutorial: this.startTutorial,
			stopTutorial: this.stopTutorial,
			runAll: this.runAllExercise,
			shareAll: this.shareAll,
			evaluateMode: this.props.evaluate,
		};
		return (
			<React.Fragment>
				<MainToolbar
					{...this.props}
					{...navFunctions}
					showTutorial={this.state.showTutorial}
					shared_exercises={this.props.shared_exercises}
				/>
				<button
					className={
						"toolbutton" + (!this.props.inFullscreenMode ? " toolbar-hide" : "")
					}
					id='unfullscreen-button'
					title={unFullScreen}
					onClick={this.props.toggleFullscreen}
				/>
			</React.Fragment>
		);
	}
}

function mapStateToProps(state) {
	return {
		exercises: state.exercises,
		isRunAll: state.isRunAll,
		exercise_running: state.exerciseRunning,
		isHost: state.isHost,
		isShared: state.isShared,
		shared_exercises: state.shared_exercises,
		evaluationMode: state.evaluation_mode,
		evaluationExercies: state.evaluation_exercise,
	};
}

export default injectIntl(
	withRouter(
		connect(mapStateToProps, {
			setExerciseIndex,
			setEvaluationMode,
		})(Navbar)
	)
);
