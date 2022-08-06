import { SET_RUN_ALL_EXERCISE } from "../actionTypes";

const run_all = (state = false, action) => {
	switch (action.type) {
		case SET_RUN_ALL_EXERCISE:
			return action.runAll;
		default:
			return state;
	}
};

export default run_all;
