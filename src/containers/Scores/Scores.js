import React, { Component } from "react";
import { Bar } from "react-chartjs-2";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { injectIntl, FormattedMessage } from "react-intl";
import {
	SCORES,
	QUESTION,
	CORRECT_WRONG,
	CORRECT_ANSWER,
	YOUR_ANSWER,
	TIME,
	YOUR_RESULTS,
	DETAILS,
	NEXT_EXERCISE,
	FINISH_EXERCISE,
	HOME,
} from "../translation";
import {
	setRunAllExercise,
	setExerciseIndex,
} from "../../store/actions/sugarizer";
import "../../css/PresenceScores.css";
import "../../css/Scores.css";
import withScoreHOC from "./ScoreHoc";

class Scores extends Component {
	constructor(props) {
		super(props);

		let { intl } = this.props;
		this.intl = intl;
		this.modes = {
			SCORE: "score",
			TIME: "time",
			DETAILS: "details",
		};

		this.state = {
			mode: this.props.evaluationMode == "async" || this.props.evaluationMode == "real" ? this.modes.DETAILS : this.modes.SCORE,
			chartScores: {
				chartData: {},
				options: {
					title: {
						display: true,
						text: intl.formatMessage({ id: YOUR_RESULTS }),
						fontSize: 40,
					},
					legend: {
						display: false,
						position: "right",
					},
					scales: {
						yAxes: [
							{
								id: "A",
								type: "linear",
								position: "left",
								ticks: {
									beginAtZero: true,
									min: 0,
									max: 100,
									callback: function (value, index, ticks) {
										return value + " %";
									},
								},
							},
						],
						xAxes: [
							{
								barThickness: 30,
								ticks: {
									fontSize: 15,
								},
							},
						],
					},
				},
			},
			chartTimes: {
				chartData: {},
				options: {
					title: {
						display: true,
						text: intl.formatMessage({ id: YOUR_RESULTS }),
						fontSize: 40,
					},
					legend: {
						display: false,
						position: "right",
					},
					scales: {
						yAxes: [
							{
								id: "A",
								type: "linear",
								position: "left",
								ticks: {
									beginAtZero: true,
									min: 0,
									max: 0,
									gridLines: {
										drawTicks: false,
									},
									callback: function (value, index, ticks) {
										return value + " mn";
									},
								},
							},
						],
						xAxes: [
							{
								barThickness: 30,
								ticks: {
									fontSize: 15,
								},
							},
						],
					},
				},
			},
		};
	}

	componentDidMount() {
		if (this.props.location) {
			if (this.props.location.state.next) {
				this.nextExercise();
			}
			const { userScore, userTime, noOfQuestions, exercise, userAnswers } =
				this.props.location.state;
			let score = Math.ceil((userScore / noOfQuestions) * 100);
			let time = Math.ceil(userTime / 60);
			if (this.props.isShared && this.props.evaluationMode === "") {
				this.props.onSharedResult(exercise.id, score, time, userAnswers);
			}
			this.setChart();
		}
	}

	setChart = () => {
		const { userScore, userTime, noOfQuestions } = this.props.location.state;
		const { stroke, fill } = this.props.current_user.colorvalue
			? this.props.current_user.colorvalue
			: { stroke: "#00FFFF", fill: "#800080" };

		let score = Math.ceil((userScore / noOfQuestions) * 100);
		let time = Math.ceil(userTime / 60);
		let y_limit = Math.max(time, 10);
		const { name } = this.props.current_user;

		this.setState({
			...this.state,
			chartScores: {
				...this.state.chartScores,
				chartData: {
					labels: [name],
					datasets: [
						{
							label: this.intl.formatMessage({ id: SCORES }),
							yAxisID: "A",
							data: [score],
							backgroundColor: fill,
							borderColor: stroke,
							borderWidth: 5,
						},
					],
				},
			},
			chartTimes: {
				...this.state.chartTimes,
				chartData: {
					labels: [name],
					datasets: [
						{
							label: this.intl.formatMessage({ id: TIME }),
							yAxisID: "A",
							data: [time],
							backgroundColor: fill,
							borderColor: stroke,
							borderWidth: 5,
						},
					],
				},
				options: {
					scales: {
						yAxes: [
							{
								id: "A",
								type: "linear",
								position: "left",
								ticks: {
									beginAtZero: true,
									min: 0,
									max: y_limit,
									gridLines: {
										drawTicks: false,
									},
									callback: function (value, index, ticks) {
										return value + " mn";
									},
								},
							},
						],
						xAxes: [
							{
								barThickness: 30,
								ticks: {
									fontSize: 15,
								},
							},
						],
					},
				},
			},
		});
	};

	playExercise = (exercise) => {
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
		if (exercise.type === "WORD_PUZZLE") {
			this.props.history.push("/play/wordpuzzle", { exercise: exercise });
		}
	};

	redo = () => {
		const { exercise } = this.props.location.state;
		this.playExercise(exercise);
	};

	score = () => {
		this.setState(
			{
				mode: this.modes.SCORE,
			},
			() => {
				this.setChart();
			}
		);
	};

	time = () => {
		this.setState(
			{
				mode: this.modes.TIME,
			},
			() => {
				this.setChart();
			}
		);
	};

	detail = () => {
		this.setState(
			{
				mode: this.modes.DETAILS,
			},
			() => {
				this.setChart();
			}
		);
	};

	onGraphClicked = (event) => {
		if (event.length !== 0) {
			this.setState({
				mode: this.modes.DETAILS,
			});
		}
	};

	nextExercise = () => {
		let exercises = this.props.exercises;
		let exercise = this.props.history.location.state.exercise;
		let exerciseIndex = exercises.findIndex((obj) => obj.id === exercise.id);
		if (exerciseIndex !== exercises.length - 1) {
			if (this.props.evaluationMode !== "") {
				let index = exerciseIndex;
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
				this.playExercise(exercises[index]);
			} else {
				this.playExercise(exercises[exerciseIndex + 1]);
			}
		} else {
			this.props.setRunAllExercise(false);
			this.props.setExerciseIndex(-1);
			this.props.history.push("/");
		}
	};

	render() {
		const { getResultsTableElement, getWrongRightMarker } = this.props;
		let score_active = "";
		let time_active = "";
		let detail_active = "";
		let chart = "";
		let inEvaluation = (this.props.evaluationMode == "async" || this.props.evaluationMode == "real");

		if (this.props.location) {
			if (this.props.location.state.next) {
				return <div/>;
			}
		}

		if (this.state.mode === this.modes.SCORE) {
			score_active = "active";
			chart = (
				<Bar
					data={this.state.chartScores.chartData}
					getElementAtEvent={this.onGraphClicked}
					options={this.state.chartScores.options}
				/>
			);
		} else if (this.state.mode === this.modes.TIME) {
			time_active = "active";
			chart = (
				<Bar
					data={this.state.chartTimes.chartData}
					options={this.state.chartTimes.options}
				/>
			);
		} else if (this.state.mode === this.modes.DETAILS) {
			detail_active = "active";
			const { userAnswers } = this.props.location.state;
			let resultDetails = userAnswers.map((answer, index) => {
				return (
					<tr key={index}>
						<td>{getResultsTableElement(answer.question)}</td>
						<td>{!inEvaluation && getResultsTableElement(answer.correctAns)}</td>
						<td>{getResultsTableElement(answer.userAns)}</td>
						<td>{!inEvaluation && getWrongRightMarker(answer)}</td>
					</tr>
				);
			});

			chart = (
				<div>
					<br></br>
					<br></br>
					<table className='w-100'>
						<thead>
							<tr>
								<th>
									<FormattedMessage id={QUESTION} />
								</th>
								<th>
									{!inEvaluation && <FormattedMessage id={CORRECT_ANSWER} />}
								</th>
								<th>
									<FormattedMessage id={YOUR_ANSWER} />
								</th>
								<th>
									{!inEvaluation && <FormattedMessage id={CORRECT_WRONG} />}
								</th>
							</tr>
						</thead>
						<tbody>{resultDetails}</tbody>
					</table>
				</div>
			);
		}

		let score = (
			<FormattedMessage id={SCORES} defaultMessage={SCORES}>
				{(msg) => (
					<button
						type='button'
						title={msg}
						className={"score-button " + score_active}
						onClick={this.score}
					/>
				)}
			</FormattedMessage>
		);
		let time = (
			<FormattedMessage id={TIME} defaultMessage={TIME}>
				{(msg) => (
					<button
						type='button'
						title={msg}
						className={"time-button " + time_active}
						onClick={this.time}
					/>
				)}
			</FormattedMessage>
		);
		let detail = (
			<FormattedMessage id={DETAILS} defaultMessage={DETAILS}>
				{(msg) => (
					<button
						type='button'
						title={msg}
						className={"detail-button " + detail_active}
						onClick={this.detail}
					/>
				)}
			</FormattedMessage>
		);

		return (
			<div className='container'>
				<div className='container-fluid'>
					<div className='row'>
							{!inEvaluation && score}
							{!inEvaluation && time}
							{!inEvaluation && detail}
							{chart}
					</div>
					<div className='row button-container'>
						{this.props.history.location.state.exercise.evaluation ? (
							<div/>
						) : this.props.isRunAll ? (
							<button className='btn next-button' onClick={this.nextExercise}>
								{this.props.runningExercise !==
								this.props.exercises.length - 1 ? (
									<FormattedMessage id={NEXT_EXERCISE} />
								) : (
									<FormattedMessage id={FINISH_EXERCISE} />
								)}
							</button>
						) : (
							<button className='button-redo' onClick={this.redo} />
						)}
					</div>
				</div>
			</div>
		);
	}
}

function MapStateToProps(state) {
	return {
		current_user: state.current_user,
		isShared: state.isShared,
		isRunAll: state.isRunAll,
		exercises: state.exercises,
		runningExercise: state.exerciseRunning,
		evaluationMode: state.evaluation_mode,
		evaluationExercies: state.evaluation_exercise,
	};
}

export default withScoreHOC()(
	injectIntl(
		withRouter(
			connect(MapStateToProps, {
				setRunAllExercise,
				setExerciseIndex,
			})(Scores)
		)
	)
);
