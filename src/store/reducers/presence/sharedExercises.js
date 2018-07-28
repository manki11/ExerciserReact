import {GET_SHARED_EXERCISES, ADD_SHARED_EXERCISE} from "../../actionTypes";

const sharedExercises=(state = [], action)=> {
    switch (action.type) {
        case GET_SHARED_EXERCISES:
            return state;
        case ADD_SHARED_EXERCISE:
            return [...state, action.exercise]
        default:
            return state
    }
};

export default sharedExercises;