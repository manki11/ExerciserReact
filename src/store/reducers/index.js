import {combineReducers} from "redux";
import exercises from "./exercises"
import exercise_counter from "./exercise_counter"
import isHost from "./presence/isHost";
import isShared from "./presence/isShared";
import sharedExercises from "./presence/sharedExercises"
import users from "./presence/users";


const rootReducer = combineReducers({
    exercises,
    exercise_counter,
    isHost: isHost,
    isShared: isShared,
    shared_exercises: sharedExercises,
    users: users
});

export default rootReducer;
