import {GET_SHARED_EXERCISES, ADD_SHARED_EXERCISE,REMOVE_SHARED_EXERCISE} from "../../actionTypes";

const sharedExercises=(state = [], action)=> {
    switch (action.type) {
        case GET_SHARED_EXERCISES:
            return state;
        case ADD_SHARED_EXERCISE:
            return [...state, action.exercise];
        case REMOVE_SHARED_EXERCISE:
            return state.filter(exercise => exercise.id !== action.id);
        default:
            return state
    }
};

export default sharedExercises;