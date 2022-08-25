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
	USERS,
	TIME,
	YOUR_RESULTS,
} from "../translation";
import "../../css/PresenceScores.css";
import withScoreHOC from "./ScoreHoc";
import UserIcon from "../../components/UserIcon";

class PresenceScores extends Component {
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
			mode: this.modes.SCORE,
			userDetailsIndex: 0,
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

	compare_score = (a, b) => {
		if (a.score < b.score) {
			return 1;
		}
		if (b.score < a.score) {
			return -1;
		}
		return 0;
	};

	compare_time = (a, b) => {
		if (a.time > b.time) {
			return 1;
		}
		if (b.time < a.time) {
			return -1;
		}
		return 0;
	};

	componentWillReceiveProps() {
		if (this.props.location) {
			this.setChart();
		}
	}

	componentDidMount() {
		if (this.props.location) {
			this.setChart();
		}
	}

	setChart = () => {
		const { exercise } = this.props.location.state;
		const { score } = this.state;

		const { shared_results } = exercise;

		let users = [];
		let strokes = [];
		let fills = [];
		let scores = [];
		let times = [];

		if (score) shared_results.sort(this.compare_score);
		else shared_results.sort(this.compare_time);

		shared_results.forEach((result, index) => {
			users.push(result.user.name);
			strokes.push(result.user.colorvalue.stroke);
			fills.push(result.user.colorvalue.fill);
			scores.push(result.score);
			times.push(result.time);
		});
		let y_limit = Math.max(...times, 10);
		if (this.state.mode === this.modes.SCORE) {
			this.setState({
				...this.state,
				chartScores: {
					...this.state.chartScores,
					chartData: {
						labels: users,
						datasets: [
							{
								label: this.intl.formatMessage({ id: SCORES }),
								yAxisID: "A",
								data: scores,
								backgroundColor: fills,
								borderColor: strokes,
								borderWidth: 5,
							},
						],
					},
				},
			});
		} else if (this.state.mode === this.modes.TIME) {
			this.setState({
				...this.state,
				chartTimes: {
					...this.state.chartTimes,
					chartData: {
						labels: users,
						datasets: [
							{
								label: this.intl.formatMessage({ id: TIME }),
								yAxisID: "A",
								data: times,
								backgroundColor: fills,
								borderColor: strokes,
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
		}
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
				userDetailsIndex: event[0]["_index"],
				mode: this.modes.DETAILS,
			});
		}
	};

	setDetailedResultUser = (index) => {
		this.setState({
			userDetailsIndex: index,
		});
	};

	render() {
		const { getResultsTableElement, getWrongRightMarker } = this.props;
		let score_active = "";
		let time_active = "";
		let detail_active = "";
		let chart = "";

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
			const { exercise } = this.props.location.state;
			const { shared_results } = exercise;
			let users = [];
			let allUserAnswers = [];
			shared_results.forEach((result) => {
				users.push(result.user.name);
				allUserAnswers.push(result.userAnswers);
			});

			if (shared_results.length) {
				let userAnswers = allUserAnswers[this.state.userDetailsIndex];
				let resultDetails = userAnswers.map((answer, index) => {
					return (
						<tr key={index}>
							<td>{getResultsTableElement(answer.question)}</td>
							<td>{getResultsTableElement(answer.correctAns)}</td>
							<td>{getResultsTableElement(answer.userAns)}</td>
							<td>{getWrongRightMarker(answer)}</td>
						</tr>
					);
				});

				let usersMenu = shared_results.map((sharedUser, index) => {
					return (
						<tr
							className={
								this.state.userDetailsIndex !== index
									? "shared-results-user-selected"
									: ""
							}
						>
							<td
								onClick={() => {
									this.setDetailedResultUser(index);
								}}
								style={{
									backgroundColor:
										this.state.userDetailsIndex === index ? `#808080` : "",
								}}
							>
								<span className='user-icon'>
									<UserIcon
										width='60%'
										height='80%'
										stroke_color={sharedUser.user.colorvalue.stroke}
										fill_color={sharedUser.user.colorvalue.fill}
									/>
								</span>
								<span>{sharedUser.user.name}</span>
							</td>
						</tr>
					);
				});

				chart = (
					<div style={{ display: "flex" }}>
						<div className='col-md-3'>
							<br></br>
							<br></br>
							<br></br>
							<table style={{ width: "100%" }}>
								<thead>
									<tr>
										<th>
											<FormattedMessage id={USERS} />
										</th>
									</tr>
								</thead>
								<tbody>{usersMenu}</tbody>
							</table>
						</div>
						<div className='col-md-9'>
							<br></br>
							<br></br>
							<table style={{ width: "100%" }}>
								<thead>
									<tr>
										<th>
											<FormattedMessage id={QUESTION} />
										</th>
										<th>
											<FormattedMessage id={CORRECT_ANSWER} />
										</th>
										<th>{users[this.state.userDetailsIndex]}</th>
										<th>
											<FormattedMessage id={CORRECT_WRONG} />
										</th>
									</tr>
								</thead>
								<tbody>{resultDetails}</tbody>
							</table>
						</div>
					</div>
				);
			}
		}

		let score = (
			<button
				type='button'
				className={"score-button " + score_active}
				onClick={this.score}
			/>
		);
		let time = (
			<button
				type='button'
				className={"time-button " + time_active}
				onClick={this.time}
			/>
		);
		let detail = (
			<button
				type='button'
				className={"detail-button " + detail_active}
				onClick={this.detail}
			/>
		);

		return (
			<div className='container'>
				<div className='container-fluid'>
					<div className='row'>
						{score}
						{time}
						{detail}
						{chart}
					</div>
				</div>
			</div>
		);
	}
}

function MapStateToProps(state) {
	return {};
}

export default withScoreHOC()(
	injectIntl(withRouter(connect(MapStateToProps, {})(PresenceScores)))
);
