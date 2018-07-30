import {IS_HOST, IS_SHARED, GET_SHARED_EXERCISES, ADD_SHARED_EXERCISE, REMOVE_SHARED_EXERCISE, ADD_USER, REMOVE_USER,ADD_SHARED_RESULT} from "../actionTypes";

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

export const addSharedResult= (result)=>({
    type: ADD_SHARED_RESULT,
    result
});

export const removeSharedExercise= (id)=> ({
    type: REMOVE_SHARED_EXERCISE,
    id
});

export const addUser= (user)=> ({
    type: ADD_USER,
    user
});

export const removeUser= (user)=> ({
    type: REMOVE_USER,
    user
});