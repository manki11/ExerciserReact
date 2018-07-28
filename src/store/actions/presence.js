import {IS_HOST, IS_SHARED, GET_SHARED_EXERCISES, ADD_SHARED_EXERCISE} from "../actionTypes";

export const setIsHost= (isHost)=> ({
    type: IS_HOST,
    isHost
});

export const setIsShared= (isShared)=> ({
    type: IS_SHARED,
    isShared
});

export const getSharedExercises= ()=>({
    type: GET_SHARED_EXERCISES
});

export const addSharedExercise= (exercise)=>({
    type: ADD_SHARED_EXERCISE,
    exercise
});