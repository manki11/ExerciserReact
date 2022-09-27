import {
	ADD_EVALUATION_EXERCISE,
	SET_EVALUATION_EXERCISE,
	UPDATE_EVALUATED_EXERCISE,
} from "../actionTypes";

const DEFAULT_STATE = [];

const evaluation_exercise = (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case SET_EVALUATION_EXERCISE:
			console.log("evaluation reducer set exercise");
			return [...action.exercises];

		case ADD_EVALUATION_EXERCISE:
			return [...state, action.exercise];

		case UPDATE_EVALUATED_EXERCISE:
			let exercises = [];
			state.forEach((exercise) => {
				if (exercise.id === action.id) {
					exercises.push({ ...exercise, evaluation: action.evaluation });
				} else {
					exercises.push(exercise);
				}
			});
			state = exercises;
			return state;
		default:
			return state;
	}
};

export default evaluation_exercise;
