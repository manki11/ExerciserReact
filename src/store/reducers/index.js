import {combineReducers} from "redux";
import exercises from "./exercises"
import exercise_counter from "./exercise_counter"
import isHost from "./presence/isHost";
import isShared from "./presence/isShared";
import sharedExercises from "./presence/sharedExercises"


const rootReducer = combineReducers({
    exercises,
    exercise_counter,
    isHost: isHost,
    isShared: isShared,
    shared_exercises: sharedExercises
});

export default rootReducer;
