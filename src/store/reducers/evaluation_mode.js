import { SET_EVALUATION_MODE } from "../actionTypes";

const evaluationMode = (state = {}, action) => {
	switch (action.type) {
		case SET_EVALUATION_MODE:
			return action.mode;
		default:
			return state;
	}
};

export default evaluationMode;
