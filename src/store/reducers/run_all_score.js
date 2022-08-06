import { RESET_SCORE, SET_TOTAL_SCORE } from "../actionTypes";

const run_all_total_score = (state = 0, action) => {
	switch (action.type) {
		case SET_TOTAL_SCORE:
			return state + action.score;
		case RESET_SCORE:
			return 0;
		default:
			return state;
	}
};

export default run_all_total_score;
