import {ADD_NEW_EXERCISE_TYPE, ADD_NEW_EXERCISE_QUES, ADD_NEW_EXERCISE_ID} from "../actionTypes";

export const setNewExerciseType= (template)=> ({
    type: ADD_NEW_EXERCISE_TYPE,
    template

});

export const addNewExerciseQuestion= (question)=> ({
    type: ADD_NEW_EXERCISE_QUES,
    question
});

export const setNewExerciseID= (id)=> ({
    type: ADD_NEW_EXERCISE_ID,
    id
});