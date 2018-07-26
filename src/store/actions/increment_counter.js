import {INCREMENT_ID, SET_COUNTER} from "../actionTypes";

export const incrementExerciseCounter= ()=> ({
    type: INCREMENT_ID
});

export const setExerciseCounter= (counter)=> ({
    type: SET_COUNTER,
    counter
});