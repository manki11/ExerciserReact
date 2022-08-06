import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import "../css/Navbar.css";
import { injectIntl } from "react-intl";
import { UNFULLSCREEN } from "../containers/translation";
import MainToolbar from "./MainToolbar";
import { setExerciseIndex, resetScore } from "../store/actions/sugarizer";

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
		this.props.runAllExercise();
		this.props.setExerciseIndex(0);
		this.props.resetScore();
		let exercise = this.props.exercises[0];
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

	render() {
		let unFullScreen = this.props.intl.formatMessage({ id: UNFULLSCREEN });
		let navFunctions = {
			directToNew: this.directToNew,
			directToHome: this.directToHome,
			enterEditMode: this.enterEditMode,
			exitEditMode: this.exitEditMode,
			startTutorial: this.startTutorial,
			stopTutorial: this.stopTutorial,
		};
		return (
			<React.Fragment>
				<MainToolbar
					{...this.props}
					{...navFunctions}
					showTutorial={this.state.showTutorial}
					runAll={this.runAllExercise}
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
	};
}

export default injectIntl(
	withRouter(connect(mapStateToProps, { setExerciseIndex, resetScore })(Navbar))
);
