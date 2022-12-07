import { SHARE_ALL_EXERCISES } from "../../actionTypes";

const sharedAllExercises = (state = {}, action) => {
	switch (action.type) {
		case SHARE_ALL_EXERCISES:
			return { exercises: [...action.shared_exercises], allow_run_all: true };
		default:
			return state;
	}
};

export default sharedAllExercises;
