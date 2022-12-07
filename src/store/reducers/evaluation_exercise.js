import {
	ADD_EVALUATION_EXERCISE,
	PRESENCE_ADD_EVALUATION_EXERCISES,
	SET_EVALUATION_EXERCISE,
	UPDATE_EVALUATED_EXERCISE,
} from "../actionTypes";

const DEFAULT_STATE = [];

const evaluation_exercise = (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case SET_EVALUATION_EXERCISE:
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
		case PRESENCE_ADD_EVALUATION_EXERCISES:
			let temp = state;
			action.exercises.forEach((exercise) => {
				if (!temp.find((x) => x.id === exercise.id)) {
					temp.push(exercise);
				}
			});
			state = temp;
			return state;
		default:
			return state;
	}
};

export default evaluation_exercise;
