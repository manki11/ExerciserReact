import { SET_EXERCISE_INDEX } from "../actionTypes";

const run_all_exercise_index = (state = -1, action) => {
	switch (action.type) {
		case SET_EXERCISE_INDEX:
			return action.index;
		default:
			return state;
	}
};

export default run_all_exercise_index;
