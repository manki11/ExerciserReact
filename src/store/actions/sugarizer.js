import {
	RESET_SCORE,
	SET_EXERCISE_INDEX,
	SET_RUN_ALL_EXERCISE,
	SET_TOTAL_SCORE,
	SET_USER,
} from "../actionTypes";

export const setUser = (user) => ({
	type: SET_USER,
	user,
});

export const setRunAllExercise = (runAll) => ({
	type: SET_RUN_ALL_EXERCISE,
	runAll,
});

export const setExerciseIndex = (index) => ({
	type: SET_EXERCISE_INDEX,
	index,
});

export const setTotalScore = (score) => ({
	type: SET_TOTAL_SCORE,
	score,
});

export const resetScore = () => ({
	type: RESET_SCORE,
});
