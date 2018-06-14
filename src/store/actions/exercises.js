import {GET_ALL_EXERCISES, REMOVE_EXERCISE} from "../actionTypes";

export const loadExercises= ()=> ({
    type: GET_ALL_EXERCISES
});

export const removeExercises= (id)=> ({
    type: REMOVE_EXERCISE,
    id
});