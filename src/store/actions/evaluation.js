import {
	ADD_EVALUATION_EXERCISE,
	PRESENCE_ADD_EVALUATION_EXERCISES,
	SET_EVALUATION_EXERCISE,
	SET_EVALUATION_MODE,
	UPDATE_EVALUATED_EXERCISE,
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

export const updateEvaluatedExercise = (id, evaluation) => {
	return {
		type: UPDATE_EVALUATED_EXERCISE,
		id,
		evaluation,
	};
};

export const addEvaluationExercisesPresence = (exercises) => {
	return {
		type: PRESENCE_ADD_EVALUATION_EXERCISES,
		exercises,
	};
};
