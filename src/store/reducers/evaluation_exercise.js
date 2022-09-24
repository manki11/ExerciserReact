import {
	ADD_EVALUATION_EXERCISE,
	SET_EVALUATION_EXERCISE,
} from "../actionTypes";

const DEFAULT_STATE = [];

const evaluation_exercise = (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case SET_EVALUATION_EXERCISE:
			return [...action.exercises];

		case ADD_EVALUATION_EXERCISE:
			return [...state, action.exercise];

		default:
			return state;
	}
};

export default evaluation_exercise;
