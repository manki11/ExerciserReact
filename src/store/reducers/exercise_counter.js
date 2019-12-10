import { INCREMENT_ID, SET_COUNTER } from "../actionTypes";

const exercise_counter = (state = 1, action) => {
	switch (action.type) {
		case INCREMENT_ID:
			return state + 1;
		case SET_COUNTER:
			return action.counter;
		default:
			return state
	}
};

export default exercise_counter;