/*
This file includes :-
	Components: WordPuzzlePlayer, WordGrid
	Helper Class: PuzzleBuilder, Grid
*/
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { addScoreTime } from "../../store/actions/exercises";
import { updateEvaluatedExercise } from "../../store/actions/evaluation";
import { setExerciseIndex } from "../../store/actions/sugarizer";
import "../../css/WordPuzzlePlayer.css";

import { FINISH_EXERCISE } from "../translation";
import { FormattedMessage } from "react-intl";

import meSpeak from "mespeak";
import withMultimedia from "../../components/WithMultimedia";
import { PlayerMultimediaJSX } from "../../components/MultimediaJSX";
import { setDefaultMedia } from "../../utils";

//component: WordPuzzlePlayer
class WordPuzzlePlayer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: -1,
			title: "",
			questions: [],
			submitted: false,
			scores: [],
			times: [],
			goBackToEdit: false,
			finish: false,
			userLanguage: "",
			wordList: [],
			diagonals: false,
		};
		this.currentTime = 0;
		this.intervalId = setInterval(this.timer, 1000);
	}

	// Load the exercise from props
	componentDidMount() {
		if (this.props.location.state) {
			const { id, title, questions, scores, times, userLanguage, diagonals } = this.props.location.state.exercise;
			const updatedQuestions = questions.map((obj) => {
				return {
					...obj,
					question: setDefaultMedia(obj.question),
					solved: false,
				};
			});
			const wordList = questions.map((obj) => obj.answer.trim());

			let goBackToEdit = false;
			if (this.props.location.state.edit) goBackToEdit = true;

			this.setState(
				{
					...this.state,
					id: id,
					title: title,
					questions: updatedQuestions,
					noOfQuestions: questions.length,
					scores: scores,
					times: times,
					goBackToEdit: goBackToEdit,
					userLanguage: userLanguage,
					wordList: wordList,
					diagonals: diagonals,
				},
				() => {
					if (userLanguage.startsWith("en")) meSpeak.loadVoice(require(`mespeak/voices/en/${this.state.userLanguage}.json`));
					else meSpeak.loadVoice(require(`mespeak/voices/${this.state.userLanguage}.json`));
				}
			);
		}
	}

	timer = () => {
		this.currentTime++;
	};
	componentWillUnmount() {
		clearInterval(this.intervalId);
	}

	speak(elem, text) {
		const audioElem = elem;
		const myDataUrl = meSpeak.speak(text, { rawdata: "data-url" });
		const sound = new Audio(myDataUrl);
		audioElem.classList.remove("button-off");
		audioElem.classList.add("button-on");
		sound.play();
		sound.onended = () => {
			audioElem.classList.remove("button-on");
			audioElem.classList.add("button-off");
		};
	}

	updateSolvedQuestion = (questionNo) => {
		const { questions } = this.state;
		if (questions[questionNo]) {
			questions[questionNo].solved = true;
			this.setState({
				questions: [...questions],
			});
		}
		console.log(this.state.questions);
	};

	// Finish the exercise ( calculate score and time )
	// Redirect to Score/Edit screen
	finishExercise = () => {
		const { questions, id, scores, times, noOfQuestions, goBackToEdit } = this.state;
		const currentTime = this.currentTime;
		const exercise = this.props.location.state.exercise;
		let currentScore = 0;
		const userAnswers = questions.map((ques) => {
			let ansData = "";
			if (ques.solved === true) {
				ansData = ques.answer;
				currentScore += 1;
			}
			return {
				question: ques.question,
				correctAns: {
					data: ques.answer,
					type: "text",
				},
				userAns: {
					data: ansData,
					type: "text",
				},
			};
		});

		if (goBackToEdit) this.props.history.push("/edit/wordpuzzle", { exercise: exercise });
		else {
			if (this.props.isRunAll) {
				// set index of exercise in run all
				this.props.setExerciseIndex(this.props.exercises.findIndex((item) => item.id === exercise.id));
			}

			scores.push(currentScore);
			times.push(currentTime);
			this.props.addScoreTime(id, currentScore, currentTime);

			if (this.props.evaluationMode !== "") {
				if (exercise.shared) {
					const scorePercentage = Math.ceil((currentScore / questions.length) * 100);
					const time = Math.ceil(currentTime / 60);
					this.props.onSharedResult(exercise.id, scorePercentage, time, userAnswers);
				}
				let evaluation = {
					userScore: currentScore,
					scores: scores,
					times: times,
					userTime: currentTime,
					noOfQuestions: noOfQuestions,
					exercise: exercise,
					userAnswers: userAnswers,
					type: "WORD_PUZZLE",
				};
				this.props.updateEvaluatedExercise(this.state.id, evaluation);
				if (this.props.isRunAll) {
					this.props.history.push("/scores", {
						next: true,
						exercise: exercise,
					});
				} else {
					this.props.history.push("/");
				}
			} else {
				this.props.history.push("/scores", {
					userScore: currentScore,
					scores: scores,
					times: times,
					userTime: currentTime,
					noOfQuestions: noOfQuestions,
					exercise: exercise,
					userAnswers: userAnswers,
					type: "WORD_PUZZLE",
				});
			}
		}
	};

	render() {
		const wordList = this.state.wordList.slice();
		const { showMedia, ShowModalWindow } = this.props;

		const finishButton = <FormattedMessage id={FINISH_EXERCISE} />;
		const questionsList = this.state.questions.map((ques, i) => {
			const quesType = ques.question.type;
			const quesData = ques.question.data;
			const solved = ques.solved;
			return (
				<div className={"question" + (solved ? " solved" : "")} key={`question-${i}`}>
					<li className="question-count">{i + 1}.</li>
					<PlayerMultimediaJSX
						questionType={quesType || "text"}
						questionData={quesData}
						speak={this.speak}
						showMedia={showMedia}
						willSpeak={true}
						className=""
					/>
				</div>
			);
		});

		return (
			<div className={"word-puzzle-container" + (this.props.inFullscreenMode ? " wp-fullscreen" : "")}>
				<WordGrid wordList={this.state.wordList} updateSolvedQuestion={this.updateSolvedQuestion} diagonals={this.diagonals} />

				<div className="word-puzzle-ques">
					<ol className="questions-container">{questionsList}</ol>
					<button onClick={this.finishExercise} className="btn">
						{finishButton}
					</button>
				</div>
				<ShowModalWindow />
			</div>
		);
	}
}

function MapStateToProps(state) {
	return {
		isRunAll: state.isRunAll,
		exercises: state.exercises,
		evaluationMode: state.evaluation_mode,
	};
}

export default withMultimedia(require("../../media/template/mcq_image.svg"))(
	withRouter(
		connect(MapStateToProps, {
			addScoreTime,
			setExerciseIndex,
			updateEvaluatedExercise,
		})(WordPuzzlePlayer)
	)
);

//component: WordGrid
class WordGrid extends Component {
	constructor(props) {
		super(props);
		this.selectionStart = this.selectionStart.bind(this);
		this.selectionEnd = this.selectionEnd.bind(this);
		this.mouseOver = this.mouseOver.bind(this);

		this.touchMove = this.touchMove.bind(this);
		this.touchEnd = this.touchEnd.bind(this);

		this.wpuzzle = this.getPuzzleObj();
		this.state = {
			puzzleGrid: this.wpuzzle.puzzleGrid,
		};
	}
	getPuzzleObj() {
		return new PuzzleBuilder(
			this.props.wordList.map((word) => ({
				text: word,
				found: false,
			})),
			true,
			true
		);
	}

	componentDidUpdate(prevProps) {
		if (prevProps.wordList === this.props.wordList) return;
		this.wpuzzle = this.getPuzzleObj();
		this.setState({
			puzzleGrid: this.wpuzzle.puzzleGrid,
		});
	}

	updatePuzzle() {
		this.wpuzzle.setHighlightedCells(this.startCellId, this.endCellId);
		this.setState({
			puzzleGrid: this.wpuzzle.puzzleGrid,
		});
	}

	selectionStart(e) {
		this.mouseDown = true;
		this.startCellId = this.endCellId = e.target.id;
		this.updatePuzzle();
	}

	mouseOver(e) {
		if (!this.mouseDown) return;

		this.endCellId = e.target.id; //keeps track of endCellId
		this.updatePuzzle();
	}

	touchMove(e) {
		if (!this.mouseDown) return;
		const touch = e.touches[0];
		const prevId = this.endCellId;

		const element = document.elementFromPoint(touch.clientX, touch.clientY);
		if (element && element.classList.contains("cell")) {
			this.endCellId = element.id;
		} else return;

		if (this.endCellId === prevId) return;
		this.updatePuzzle();
	}

	touchEnd(e) {
		if (!this.endCellId) return;
		const touch = e.changedTouches[0];
		const element = document.elementFromPoint(touch.clientX, touch.clientY);
		if (element && element.classList.contains("cell")) {
			this.endCellId = element.id;
		}
		this.selectionEnd();
	}

	selectionEnd() {
		this.mouseDown = false;
		if (!this.endCellId) return;

		const { foundWordIndex, cells } = this.wpuzzle.testString(this.startCellId, this.endCellId);
		if (foundWordIndex !== -1) this.props.updateSolvedQuestion(foundWordIndex);

		this.wpuzzle.unHighlightCells();
		if (cells) this.wpuzzle.highlight(cells, true);

		this.startCellId = null;
		this.endCellId = null;
		this.setState({
			puzzleGrid: [...this.wpuzzle.puzzleGrid],
		});
		return false;
	}

	render() {
		const puzzleGrid = this.state.puzzleGrid;

		return (
			<div className="word-grid">
				{/*---------------- Grid array ----------------*/}
				{puzzleGrid.map((row, i) => {
					return (
						<div className="row-grid" key={`row-${i}`}>
							{/*------------- Row of Grid ----------------*/}
							{row.map((cell, i) => {
								const cellClass = "cell " + (cell.highlight ? "highlight " : cell.found ? "found" : "");

								/*----------- Cell ------------------*/
								return (
									<div
										className={cellClass}
										key={cell.id}
										id={cell.id}
										onMouseDown={this.selectionStart}
										onMouseUp={this.selectionEnd}
										onMouseOver={this.mouseOver}
										onTouchStart={this.selectionStart}
										onTouchMove={this.touchMove}
										onTouchEnd={this.touchEnd}
									>
										{cell.letter}
									</div>
								);
							})}
						</div>
					);
				})}
			</div>
		);
	}
}

//class: PuzzleBuilder
class PuzzleBuilder {
	static DIRECTIONS = {
		RIGHT: [0, 1], // 0 -> dy (change in row), 1 -> dx (change in column)
		DOWN: [1, 0],
		LEFT: [0, -1],
		UP: [-1, 0],
		RIGHT_DOWN: [1, 1],
		LEFT_UP: [-1, -1],
		LEFT_DOWN: [1, -1],
		RIGHT_UP: [-1, 1],
	};
	constructor(wordList, diagonal = false, backward = false) {
		const DIRECTIONS = PuzzleBuilder.DIRECTIONS;

		this.alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		this.wordList = wordList;

		this.directions = [DIRECTIONS.RIGHT, DIRECTIONS.DOWN];
		if (diagonal) this.directions.push(DIRECTIONS.RIGHT_DOWN);
		if (backward) this.directions.push(DIRECTIONS.LEFT, DIRECTIONS.UP);
		if (diagonal && backward) this.directions.push(DIRECTIONS.LEFT_UP, DIRECTIONS.RIGHT_UP, DIRECTIONS.LEFT_DOWN);

		this.puzzleSize = 0;
		this.calcPuzzleSize();
		this.puzzleGrid = [];
		this.initGrid();
		// this.populateUnusedCells();

		this.prevSelectedCells = [];
	}

	initGrid() {
		if (!this.wordList || !this.wordList.length) return false;
		const positions = Array.from({ length: this.puzzleSize * this.puzzleSize }, (_, i) => i);
		const words = this.wordList.map((word) => word.text);

		const stack = [
			{
				grid: new Grid(this.puzzleSize),
				word: words.shift(),
				dirs: shuffleArray(this.directions),
				positions: shuffleArray(positions),
			},
		];
		while (true) {
			const current = stack[stack.length - 1];
			if (!current) {
				console.log("No solution for given size");
				return false;
			}

			let dir = current.dirs.pop();
			if (dir === undefined) {
				// if we've tried all possible directions at this position, try next position
				current.positions.pop();
				current.dirs = shuffleArray(this.directions);
				dir = current.dirs.pop();
			}

			const pos = current.positions[current.positions.length - 1];
			// If there are no more available positions, backtrack by popping the stack.
			if (pos === undefined) {
				words.unshift(current.word);
				stack.pop();
			} else {
				const newGrid = this.tryWord(current.grid, current.word, pos, dir);
				if (newGrid) {
					if (words.length > 0) {
						stack.push({
							grid: newGrid,
							word: words.shift(),
							dirs: shuffleArray(this.directions),
							positions: shuffleArray(positions),
						});
					} else {
						// Store the final grid
						this.puzzleGrid = newGrid.getPuzzleGrid();
						break;
					}
				}
			}
		}
		return true;
	}

	tryWord(currentGrid, word, position, direction) {
		const grid = currentGrid.getClone();
		word = word.toUpperCase();
		const letters = [...word];

		let [row, column] = grid.getRowCol(position);
		const size = grid.size;
		const [dr, dc] = direction;

		while (row >= 0 && row < size && column >= 0 && column < size) {
			const letter = letters.shift();
			if (!letter) {
				break;
			}

			if (grid.getCell(row, column) === "%" || grid.getCell(row, column) === letter) {
				grid.gridArr[grid.getIndex(row, column)] = letter;
				row += dr;
				column += dc;
			} else {
				return null;
			}
		}

		return letters.length === 0 ? grid : null;
	}

	calcPuzzleSize() {
		const offset = 2;
		const len = this.wordList.length;
		const list = this.wordList;
		let currLen = len;
		for (let i = 0; i < len; i++) {
			if (list[i].text.length > currLen) {
				currLen = list[i].text.length;
			}
		}
		this.puzzleSize = currLen + offset;
	}

	populateUnusedCells() {
		if (!this.puzzleGrid.length) return;
		let indexi;
		let indexj;
		for (indexi = 0; indexi < this.puzzleSize; indexi++) {
			for (indexj = 0; indexj < this.puzzleSize; indexj++) {
				if (this.puzzleGrid[indexi][indexj].letter === "%") {
					this.puzzleGrid[indexi][indexj].letter = this.alphabets[Math.floor(Math.random() * 26)];
				}
			}
		}
	}

	getCellById(id) {
		let [row, col] = id.split("-cell-");
		return { row: parseInt(row), col: parseInt(col) };
	}

	getDirection(startCell, endCell) {
		let dx = endCell.col - startCell.col;
		let dy = endCell.row - startCell.row;
		// Get the sign
		dx = dx !== 0 ? dx / Math.abs(dx) : dx;
		dy = dy !== 0 ? dy / Math.abs(dy) : dy;

		const DIRECTIONS = PuzzleBuilder.DIRECTIONS;
		for (const direction in DIRECTIONS) {
			const [dirY, dirX] = DIRECTIONS[direction];
			if (dx === dirX && dy === dirY) {
				return direction;
			}
		}
		return null; // Invalid direction
	}

	getCellsInDir(startCellId, endCellId) {
		const startCell = this.getCellById(startCellId);
		const endCell = this.getCellById(endCellId);
		const dir = this.getDirection(startCell, endCell);

		if (dir === undefined || dir === null) return [[startCell.row, startCell.col]];
		const cellsInDir = [];
		const size = this.puzzleSize;
		const curr = startCell;
		const end = endCell;
		const [dy, dx] = PuzzleBuilder.DIRECTIONS[dir];

		let rowGap = Math.abs(end.row - curr.row);
		let colGap = Math.abs(end.col - curr.col);
		let maxIteration = Math.max(rowGap, colGap);

		cellsInDir.push([curr.row, curr.col]);
		switch (dir) {
			case "RIGHT":
			case "LEFT":
				while (curr.col !== end.col) {
					curr.col += dx;
					cellsInDir.push([curr.row, curr.col]);
				}
				break;
			case "UP":
			case "DOWN":
				while (curr.row !== end.row) {
					curr.row += dy;
					cellsInDir.push([curr.row, curr.col]);
				}
				break;
			case "RIGHT_DOWN":
				while (curr.row < size - 1 && curr.col < size - 1 && maxIteration > 0) {
					maxIteration--;
					curr.row += dy;
					curr.col += dx;
					cellsInDir.push([curr.row, curr.col]);
				}
				break;
			case "RIGHT_UP":
				while (curr.row > 0 && curr.col < size - 1 && maxIteration > 0) {
					maxIteration--;
					curr.row += dy;
					curr.col += dx;
					cellsInDir.push([curr.row, curr.col]);
				}
				break;
			case "LEFT_DOWN":
				while (curr.row < size - 1 && curr.col > 0 && maxIteration > 0) {
					maxIteration--;
					curr.row += dy;
					curr.col += dx;
					cellsInDir.push([curr.row, curr.col]);
				}
				break;
			case "LEFT_UP":
				while (curr.row > 0 && curr.col > 0 && maxIteration > 0) {
					maxIteration--;
					curr.row += dy;
					curr.col += dx;
					cellsInDir.push([curr.row, curr.col]);
				}
				break;
		}

		return cellsInDir;
	}

	testString(startCellId, endCellId) {
		let stringTest = {
			matched: false,
			matchedBackward: false,
			foundWordIndex: -1,
			cells: null,
			string: "",
		};
		let reverseStr = "";
		const cells = this.getCellsInDir(startCellId, endCellId);

		for (let i = 0; i < cells.length; i++) {
			const [row, col] = cells[i];
			const [endR, endC] = cells[cells.length - i - 1];

			stringTest.string += this.puzzleGrid[row][col].letter;
			reverseStr += this.puzzleGrid[endR][endC].letter;
		}

		let index = this.getWordIndex(stringTest.string);
		if (index !== -1) {
			stringTest.matched = true;
		} else {
			index = this.getWordIndex(reverseStr);
			stringTest.matchedBackward = index !== -1;
		}

		stringTest.foundWordIndex = index;
		if (stringTest.matched || stringTest.matchedBackward) {
			stringTest.cells = cells;
		}
		return stringTest;
	}

	getWordIndex(str) {
		for (let i = 0; i < this.wordList.length; i++) {
			const word = this.wordList[i];
			if (word.text.toUpperCase() === str.toUpperCase() && word.found === false) {
				this.wordList[i].found = true;
				return i;
			}
		}
		return -1;
	}

	unHighlightCells() {
		this.prevSelectedCells.forEach(([row, col]) => {
			this.puzzleGrid[row][col].highlight = false;
		});
	}

	setHighlightedCells(startCellId, endCellId) {
		this.unHighlightCells();

		const cells = this.getCellsInDir(startCellId, endCellId);
		this.highlight(cells, false);
	}

	highlight(cells, found) {
		this.prevSelectedCells = cells;
		cells.forEach(([row, col]) => {
			if (found) this.puzzleGrid[row][col].found = true;
			else this.puzzleGrid[row][col].highlight = true;
		});
	}
}

//class: Grid
class Grid {
	constructor(size) {
		// Grid[size * size] as 1D array
		this.gridArr = Array.from({ length: size * size }, () => "%");
		this.size = size;
	}

	getClone() {
		const clone = new Grid(this.size);
		clone.gridArr = [...this.gridArr];
		return clone;
	}
	getIndex(rowOrPos, col) {
		return rowOrPos * this.size + col;
	}
	getCell(rowOrPos, col) {
		return this.gridArr[this.getIndex(rowOrPos, col)];
	}
	getRowCol(index) {
		const row = Math.floor(index / this.size);
		const col = index % this.size;
		return [row, col];
	}

	getPuzzleGrid() {
		const puzzleGrid = [];
		for (let i = 0; i < this.size; i++) {
			const row = [];
			for (let j = 0; j < this.size; j++) {
				const cell = {
					id: `${i}-cell-${j}`,
					letter: this.gridArr[this.getIndex(i, j)],
					highlight: false,
					found: false,
				};
				row.push(cell);
			}
			puzzleGrid.push(row);
		}
		return puzzleGrid;
	}
}
// utility function
function shuffleArray(array) {
	const newArr = [...array];
	for (let i = newArr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[newArr[i], newArr[j]] = [newArr[j], newArr[i]];
	}
	return newArr;
}
