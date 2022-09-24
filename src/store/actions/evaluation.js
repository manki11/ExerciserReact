import {
	ADD_EVALUATION_EXERCISE,
	SET_EVALUATION_EXERCISE,
	SET_EVALUATION_MODE,
} from "../actionTypes";

export const setEvaluationMode = (mode) => {
	return {
		type: SET_EVALUATION_MODE,
		mode,
	};
};

export const setEvaluationExercise = (exercises) => {
	return {
		type: SET_EVALUATION_EXERCISE,
		exercises,
	};
};

export const addEvaluationExercise = (exercise) => {
	return {
		type: ADD_EVALUATION_EXERCISE,
		exercise: { ...exercise, shared: false },
	};
};
