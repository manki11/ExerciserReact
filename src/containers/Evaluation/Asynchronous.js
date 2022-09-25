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
	WRONG_ANSWER,
	YOUR_ANSWER,
	YOUR_SCORE,
} from "../translation";
import "../../css/Scores.css";
import "../../css/Evaluation.css";
import correct from "../../icons/exercise/correct.png";
import wrong from "../../icons/exercise/wrong.png";

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

	const answerStatus = (status) => {
		if (status) {
			return (
				<img src={correct} alt={<FormattedMessage id={CORRECT_ANSWER} />} />
			);
		} else {
			return <img src={wrong} alt={<FormattedMessage id={WRONG_ANSWER} />} />;
		}
	};

	useEffect(() => {
		if (exercise) {
			if (mode === modes.SCORE) {
				let score_data = exercise.evaluation.userAnswers.map(
					(userAnswer, id) => (
						<tr>
							<td>{userAnswer.question.data}</td>
							<td>{exercise.evaluation.checkedAnswers[id] ? 1 : 0}</td>
							<td>{answerStatus(exercise.evaluation.checkedAnswers[id])}</td>
						</tr>
					)
				);
				let totalScore = 0;
				exercise.evaluation.checkedAnswers.forEach((element) => {
					if (element) {
						totalScore++;
					}
				});
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
			} else if (mode == modes.DETAILS) {
				let detail_data = exercise.evaluation.userAnswers.map(
					(userAnswer, id) => (
						<tr>
							<td>{userAnswer.question.data}</td>
							<td>{userAnswer.correctAns.data}</td>
							<td>{userAnswer.userAns.data}</td>
							<td>{answerStatus(exercise.evaluation.checkedAnswers[id])}</td>
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

export default injectIntl(withRouter(connect(MapStateToProps)(Asynchronous)));
