import React, { useEffect, useState } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
	CORRECT_ANSWER,
	CORRECT_WRONG,
	DETAILS,
	DETAIL_SCORE,
	QUESTION,
	QUESTION_SCORE,
	SCORES,
	TOTAL_SCORE,
	YOUR_ANSWER,
	YOUR_SCORE,
} from "../translation";
import "../../css/Scores.css";
import "../../css/Evaluation.css";
import withScoreHOC from "../Scores/ScoreHoc";

const Asynchronous = (props) => {
	const modes = {
		SCORE: "score",
		DETAILS: "details",
	};

	const [exercise, setexercise] = useState(null);
	const [score_active, setscore_active] = useState("active");
	const [detail_active, setdetail_active] = useState("");
	const [mode, setmode] = useState(modes.SCORE);
	const [heading, setheading] = useState(
		<FormattedMessage id={QUESTION_SCORE} />
	);
	const [data, setdata] = useState("");

	useEffect(() => {
		setexercise(
			props.evaluationExercises.find((x) => x.id === props.location.state.id)
		);
	}, []);

	useEffect(() => {
		if (exercise) {
			if (mode === modes.SCORE) {
				let totalScore = 0;
				exercise.evaluation.checkans.forEach((element) => {
					if (element) {
						totalScore++;
					}
				});
				if (exercise.type === "REORDER") {
					setdata(
						<table className='w-100'>
							<thead>
								<tr>
									<th>
										<FormattedMessage id={QUESTION} />
									</th>
									<th>
										<FormattedMessage id={TOTAL_SCORE} />
									</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>
										{props.getResultsTableElement(
											exercise.evaluation.userAnswers[0].question
										)}
									</td>
									<td>{totalScore}</td>
								</tr>
							</tbody>
						</table>
					);
				} else {
					let score_data = exercise.evaluation.userAnswers.map(
						(userAnswer, id) => (
							<tr>
								<td>{props.getResultsTableElement(userAnswer.question)}</td>
								<td>{exercise.evaluation.checkans[id] ? 1 : 0}</td>
								<td>{props.getWrongRightMarker(userAnswer)}</td>
							</tr>
						)
					);

					setdata(
						<table className='w-100'>
							<thead>
								<tr>
									<th>
										<FormattedMessage id={QUESTION} />
									</th>
									<th>
										<FormattedMessage id={YOUR_SCORE} />
									</th>
									<th>
										<FormattedMessage id={CORRECT_WRONG} />
									</th>
								</tr>
							</thead>
							<tbody>
								{score_data}
								<tr>
									<th>
										<FormattedMessage id={TOTAL_SCORE} />
									</th>
									<th>{totalScore}</th>
									<td></td>
								</tr>
							</tbody>
						</table>
					);
				}
			} else if (mode === modes.DETAILS) {
				let detail_data = exercise.evaluation.userAnswers.map(
					(userAnswer, id) => (
						<tr>
							<td>{props.getResultsTableElement(userAnswer.question)}</td>
							<td>{props.getResultsTableElement(userAnswer.correctAns)}</td>
							{userAnswer.userAns.data === "_____________" ? (
								<td />
							) : (
								<td>{props.getResultsTableElement(userAnswer.userAns)}</td>
							)}
							<td>{props.getWrongRightMarker(userAnswer)}</td>
						</tr>
					)
				);

				setdata(
					<table className='w-100'>
						<thead>
							<th>
								<FormattedMessage id={QUESTION} />
							</th>
							<th>
								<FormattedMessage id={CORRECT_ANSWER} />
							</th>
							<th>
								<FormattedMessage id={YOUR_ANSWER} />
							</th>
							<th>
								<FormattedMessage id={CORRECT_WRONG} />
							</th>
						</thead>
						<tbody>{detail_data}</tbody>
					</table>
				);
			}
		}
	}, [exercise, mode]);

	const onScoreClick = () => {
		setscore_active("active");
		setdetail_active("");
		setmode(modes.SCORE);
		setheading(<FormattedMessage id={QUESTION_SCORE} />);
	};
	const onDetailClick = () => {
		setscore_active("");
		setdetail_active("active");
		setmode(modes.DETAILS);
		setheading(<FormattedMessage id={DETAIL_SCORE} />);
	};

	let score = (
		<FormattedMessage id={SCORES} defaultMessage={SCORES}>
			{(msg) => (
				<button
					type='button'
					title={msg}
					className={"score-button " + score_active}
					onClick={onScoreClick}
				/>
			)}
		</FormattedMessage>
	);
	let details = (
		<FormattedMessage id={DETAILS} defaultMessage={DETAILS}>
			{(msg) => (
				<button
					type='button'
					title={msg}
					className={"detail-button " + detail_active}
					onClick={onDetailClick}
				/>
			)}
		</FormattedMessage>
	);

	return (
		<div className='container' id='evaluation-container'>
			<div className='container-fluid'>
				<div className='row'>
					{score}
					{details}
				</div>
				<div className='row' id='evaluation-heading'>
					{heading}
				</div>
				<div className='row'>{data}</div>
			</div>
		</div>
	);
};

const MapStateToProps = (state) => {
	return {
		evaluationMode: state.evaluation_mode,
		evaluationExercises: state.evaluation_exercise,
		currentUser: state.current_user,
	};
};

export default withScoreHOC()(
	injectIntl(withRouter(connect(MapStateToProps)(Asynchronous)))
);
