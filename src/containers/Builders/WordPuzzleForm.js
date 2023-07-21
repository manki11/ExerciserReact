import React, { Component } from "react";
import "../../css/WordPuzzleForm.css";
import { connect } from "react-redux";
import { incrementExerciseCounter } from "../../store/actions/increment_counter";
import { addNewExercise, editExercise } from "../../store/actions/exercises";
import { FormattedMessage } from "react-intl";
import datastore from "lib/sugar-web/datastore";
import chooser from "lib/sugar-web/graphics/journalchooser";
import env from "lib/sugar-web/env";
import meSpeak from "mespeak";
import withMultimedia from "../../components/WithMultimedia";
import { QuestionOptionsJSX, QuestionJSX } from "../../components/MultimediaJSX";
import {
	QUESTION,
	ANSWER,
	STANDARD,
	DIFFICULT,
	STANDARD_DESC,
	DIFFICULT_DESC,
	FINISH_EXERCISE,
	TITLE_OF_EXERCISE,
	TEST_EXERCISE,
	TITLE_ERROR,
	QUESTION_ERROR,
	ANSWER_ERROR,
	WORD_PUZZLE,
} from "../translation";
import { withRouter } from "react-router-dom";
import { MULTIMEDIA, setDefaultMedia } from "../../utils";

class WordPuzzleForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			edit: false,
			id: -1,
			title: "",
			scores: [],
			times: [],
			diagonals: false,
			isFormValid: false,
			questions: [
				{
					question: {
						type: "",
						data: "",
					},
					answer: "",
				},
			],
			errors: {
				title: true,
				questions: [true],
				answer: [true],
			},
		};
		this.currentQuestionIdx = 0;
	}

	componentDidMount() {
		if (this.props.location.state) {
			// /edit/wordpuzzle load the exercise
			const { id, title, questions, scores, times, diagonals } = this.props.location.state.exercise;
			const updatedQuestions = questions.map((ques) => {
				return {
					...ques,
					question: setDefaultMedia(ques.question),
				};
			});

			const errors = {
				title: false,
				questions: new Array(questions.length).fill(false),
				answer: new Array(questions.length).fill(false),
			};
			this.setState({
				id: id,
				title: title,
				edit: true,
				isFormValid: true,
				questions: updatedQuestions,
				scores: scores,
				times: times,
				diagonals: diagonals,
				errors: errors,
			});
		}
	}
	speak = (e, text) => {
		let audioElem = e.target;
		let myDataUrl = meSpeak.speak(text, { rawdata: "data-url" });
		let sound = new Audio(myDataUrl);
		audioElem.classList.remove("button-off");
		audioElem.classList.add("button-on");
		sound.play();
		sound.onended = () => {
			audioElem.classList.remove("button-on");
			audioElem.classList.add("button-off");
		};
	};

	handleChangeTitle = (e) => {
		this.setState({
			title: e.target.value,
		});
		this.checkForErrors("title", e.target.value);
	};

	handleQuesEdit = (quesIdx) => {
		this.currentQuestionIdx = quesIdx;
		const { questions } = this.state;
		questions[quesIdx].question.type = "";
		questions[quesIdx].question.data = "";
		this.setState({ questions: [...questions] });
		this.checkForErrors("questions", "");
	};

	handleChangeQues = (quesIdx, e) => {
		this.currentQuestionIdx = quesIdx;
		const { questions } = this.state;
		questions[quesIdx].question.data = e.target.value;
		this.setState({
			question: [...questions],
		});
		this.checkForErrors("questions", e.target.value);
	};

	handleChangeAns = (quesIdx, e) => {
		this.currentQuestionIdx = quesIdx;
		const { questions } = this.state;
		questions[quesIdx].answer = e.target.value;
		this.setState({
			question: [...questions],
		});
		this.checkForErrors("answer", e.target.value);
	};

	handleNewQuestion = () => {
		const { questions, errors } = this.state;
		this.currentQuestionIdx = questions.length;
		questions.push({
			question: {
				type: "",
				data: "",
			},
			answer: "",
		});
		const newErr = {
			title: errors.title,
			questions: [...errors.questions, true],
			answer: [...errors.answer, true],
		};
		this.setState({
			question: [...questions],
			errors: newErr,
		});
	};

	onDeleteQuestion = (quesIdx, e) => {
		const { questions, errors } = this.state;
		const newErr = {
			title: errors.title,
			questions: errors.questions.filter((_, i) => i !== quesIdx),
			answer: errors.answer.filter((_, i) => i !== quesIdx),
		};

		this.currentQuestionIdx = (quesIdx + 1) % questions.length;
		this.setState({
			questions: questions.filter((_, idx) => idx !== quesIdx),
			errors: newErr,
		});
	};

	showJournalChooser = (mediaType) => {
		const { questions } = this.state;
		const quesIdx = this.currentQuestionIdx;
		const image = mediaType === MULTIMEDIA.image;
		const audio = mediaType === MULTIMEDIA.audio;
		const video = mediaType === MULTIMEDIA.video;

		env.getEnvironment((err, environment) => {
			if (environment.user) {
				// Display journal dialog popup
				chooser.show(
					(entry) => {
						if (!entry) return;
						var dataentry = new datastore.DatastoreObject(entry.objectId);
						dataentry.loadAsText((err, metadata, text) => {
							if (mediaType === MULTIMEDIA.image) this.props.showMedia(text, "img", this.setQuestionSourceFromImageEditor);
							questions[quesIdx].question.type = mediaType;
							questions[quesIdx].question.data = text;
							this.setState({
								questions: [...questions],
							});
							this.checkForErrors("questions", text);
						});
					},
					image ? { mimetype: "image/png" } : audio ? { mimetype: "audio/mp3" } : null,
					image ? { mimetype: "image/jpeg" } : audio ? { mimetype: "audio/mpeg" } : null,
					audio ? { mimetype: "audio/wav" } : video ? { mimetype: "video/mp4" } : null,
					video ? { mimetype: "video/webm" } : null
				);
			}
		});
	};

	selectQuestionType = (quesIdx, mediaType) => {
		this.currentQuestionIdx = quesIdx;
		const { questions } = this.state;
		if (mediaType === MULTIMEDIA.text || mediaType === MULTIMEDIA.textToSpeech) {
			questions[quesIdx].question.type = mediaType;
			questions[quesIdx].question.data = "";
			this.setState({
				questions: [...questions],
			});
			this.checkForErrors("answer", questions[quesIdx].answer);
		} else {
			this.showJournalChooser(mediaType);
		}
	};

	setQuestionSourceFromImageEditor = (url) => {
		const { questions } = this.state;
		questions[this.currentQuestionIdx].question.data = url;
		this.setState(
			{
				questions: [...questions],
			},
			() => {
				this.props.closeModal();
			}
		);
	};
	handleSetImgSource = (quesIdx, url) => {
		this.currentQuestionIdx = quesIdx;
		this.setQuestionSourceFromImageEditor(url);
	};

	checkForErrors(fieldName, value) {
		const errors = { ...this.state.errors };
		switch (fieldName) {
			case "title":
				errors.title = "";
				if (value === "") errors.title = true;
				break;
			case "questions":
				errors.questions[this.currentQuestionIdx] = false;
				if (value.trim() === "") {
					errors.questions[this.currentQuestionIdx] = true;
				}
				break;
			case "answer":
				errors.answer[this.currentQuestionIdx] = false;
				if (value.trim() === "") {
					errors.answer[this.currentQuestionIdx] = true;
				}
				break;
			default:
				break;
		}
		this.setState({ errors });
	}

	submitExercise = (edit, e) => {
		e.preventDefault();
		const { srcThumbnail, userLanguage } = this.props;

		const questions = this.state.questions.map((ques, idx) => ({
			id: idx + 1,
			...ques,
		}));
		let id = this.state.id;
		if (this.state.id === -1) {
			id = this.props.counter;
		}

		const exercise = {
			title: this.state.title,
			id: id,
			type: "WORD_PUZZLE",
			questions: questions,
			scores: this.state.scores,
			times: this.state.times,
			diagonals: this.state.diagonals,
			thumbnail: srcThumbnail,
			userLanguage: userLanguage,
		};

		if (this.state.edit) {
			this.props.editExercise(exercise);
		} else {
			this.props.addNewExercise(exercise);
			this.props.incrementExerciseCounter();
		}

		if (edit) this.props.history.push("/play/wordpuzzle", { exercise: exercise, edit: true });
		else this.props.history.push("/");
	};
	handleSelection = (event) => {
		const { value } = event.target;
		const diagonals = value === "difficult";
		this.setState({ diagonals });
	};

	handleNewEvent = (event) => {
		event.preventDefault();
	};

	render() {
		const { questions, errors, diagonals } = this.state;
		const { thumbnail, insertThumbnail, showMedia, ShowEditableModalWindow } = this.props;

		return (
			<div className={"container" + (this.props.inFullscreenMode ? " fullScreenPaddingMargin" : "")} id="wp-form">
				<div className="container-fluid">
					<div className="row align-items-center justify-content-center">
						<div className={"col-sm-10" + (this.props.inFullscreenMode ? " fullScreenPadding" : "")}>
							<div>
								<h5 className="wp-title">
									<FormattedMessage id={WORD_PUZZLE} />
								</h5>
								<hr className="my-3" />
								<div className="col-md-12">
									<form onSubmit={this.handleNewEvent}>
										<div className="row">
											<div className="form-group">
												{thumbnail}
												<label className="mt-3 title" htmlFor="title">
													<FormattedMessage id={TITLE_OF_EXERCISE} />
												</label>
												<button className="btn button-finish button-thumbnail" onClick={insertThumbnail} />
												<input
													className="input-mcq"
													type="text"
													id="title"
													value={this.state.title}
													onChange={this.handleChangeTitle}
													autoFocus
												/>
												<div style={{ color: "red", height: "16px" }}>
													{errors.title && <FormattedMessage id={TITLE_ERROR} />}
												</div>
											</div>
										</div>
										<div className="row">
											<h6 className="title">Difficulty</h6>
											<div className="form-group">
												<label>
													<input type="radio" value="standard" checked={!diagonals} onChange={this.handleSelection} />
													<FormattedMessage id={STANDARD} />: <FormattedMessage id={STANDARD_DESC} />
												</label>
												<br />
												<label>
													<input type="radio" value="difficult" checked={diagonals} onChange={this.handleSelection} />
													<FormattedMessage id={DIFFICULT} />: <FormattedMessage id={DIFFICULT_DESC} />
												</label>
											</div>
										</div>
										{questions.map((obj, i) => {
											const ques = obj.question;
											return (
												<div className="row mb-4" key={"r-" + i}>
													<div className="form-group">
														<span className="wp-question">
															{i + 1}. <FormattedMessage id={QUESTION} />
														</span>
														<button
															className="btn button-delete"
															onClick={(e) => this.onDeleteQuestion(i, e)}
															disabled={questions.length === 1}
														/>
														{ques.type && (
															<button className="btn button-edit" onClick={() => this.handleQuesEdit(i)}></button>
														)}
														{!ques.type && (
															<QuestionOptionsJSX
																selectQuestionType={(mediaType) => this.selectQuestionType(i, mediaType)}
															/>
														)}
														{ques.type && (
															<div>
																<QuestionJSX
																	questionType={ques.type}
																	questionData={ques.data}
																	showMedia={showMedia}
																	handleChangeQues={(e) => this.handleChangeQues(i, e)}
																	speak={this.speak}
																	setImageEditorSource={(url) => this.handleSetImgSource(i, url)}
																/>
																<div className="mt-3 ml-2 wp-answer">
																	<FormattedMessage id={ANSWER} />
																</div>
																<input
																	className="input-mcq"
																	type="text"
																	value={obj.answer}
																	maxLength={50}
																	onChange={(e) => this.handleChangeAns(i, e)}
																/>
															</div>
														)}
														<div style={{ color: "red", height: "16px" }}>
															{!errors.title &&
																(errors.questions[i] ? (
																	<FormattedMessage id={QUESTION_ERROR} />
																) : (
																	errors.answer[i] && <FormattedMessage id={ANSWER_ERROR} />
																))}
														</div>
													</div>
												</div>
											);
										})}

										<div className="row">
											<div className="form-group wp-add-question">
												<button type="button" onClick={this.handleNewQuestion} className="btn button-choices-add"></button>
												<span>
													<FormattedMessage id={QUESTION} />
												</span>
											</div>
										</div>
										<div className="form-group row justify-content-between">
											<button
												onClick={(e) => this.submitExercise(false, e)}
												className={"btn button-finish mb-2"}
												disabled={errors.title || errors.questions.includes(true) || errors.answer.includes(true)}
											>
												<FormattedMessage id={FINISH_EXERCISE} />
											</button>
											<button
												onClick={(e) => this.submitExercise(true, e)}
												className={"btn button-finish mb-2"}
												disabled={errors.title || errors.questions.includes(true) || errors.answer.includes(true)}
											>
												<FormattedMessage id={TEST_EXERCISE} />
											</button>
										</div>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
				<ShowEditableModalWindow />
			</div>
		);
	}
}

function MapStateToProps(state) {
	return {
		counter: state.exercise_counter,
	};
}

export default withMultimedia(require("../../media/template/word_puzzle_image.svg"))(
	withRouter(
		connect(MapStateToProps, {
			addNewExercise,
			incrementExerciseCounter,
			editExercise,
		})(WordPuzzleForm)
	)
);
