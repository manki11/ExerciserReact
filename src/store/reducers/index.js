import {combineReducers} from "redux";
import exercises from "./exercises"
import exercise_counter from "./exercise_counter"

const rootReducer = combineReducers({
    exercises,
    exercise_counter,
});

export default rootReducer;
