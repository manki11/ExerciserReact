import {IS_HOST, IS_SHARED, GET_SHARED_EXERCISES, ADD_SHARED_EXERCISE, REMOVE_SHARED_EXERCISE} from "../actionTypes";

export const setIsHost= ()=> ({
    type: IS_HOST,
});

export const setIsShared= ()=> ({
    type: IS_SHARED,
});

export const getSharedExercises= ()=>({
    type: GET_SHARED_EXERCISES
});

export const addSharedExercise= (exercise)=>({
    type: ADD_SHARED_EXERCISE,
    exercise
});

export const removeSharedExercise= (id)=> ({
    type: REMOVE_SHARED_EXERCISE,
    id
});