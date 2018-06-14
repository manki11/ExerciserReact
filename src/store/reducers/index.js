import {combineReducers} from "redux";
import exercises from "./exercises"
import new_exercise from "./new_exercise"
import exercise_counter from "./exercise_counter"

const rootReducer = combineReducers({
    exercises,
    exercise_counter,
    new_exercise
});

export default rootReducer;
