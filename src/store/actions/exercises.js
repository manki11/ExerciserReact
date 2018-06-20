import {GET_ALL_EXERCISES, REMOVE_EXERCISE, ADD_NEW_EXERCISE, EDIT_EXERCISE} from "../actionTypes";

export const loadExercises= ()=> ({
    type: GET_ALL_EXERCISES
});

export const removeExercises= (id)=> ({
    type: REMOVE_EXERCISE,
    id
});

export const addNewExercise= (exercise)=> ({
    type: ADD_NEW_EXERCISE,
    exercise
});

export const editExercise= (exercise)=> ({
    type: EDIT_EXERCISE,
    exercise
});