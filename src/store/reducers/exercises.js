import {GET_ALL_EXERCISES, REMOVE_EXERCISE,ADD_NEW_EXERCISE} from "../actionTypes";

const exercises=(state=[], actions)=> {
    switch(actions.type){
        case GET_ALL_EXERCISES:
            return [...actions.exercise];
        case ADD_NEW_EXERCISE:
            return [actions.exercise,...state];
        case REMOVE_EXERCISE:
            return state.filter(exercise=> exercise.id!== actions.id);
        default:
            return state;
    }
};

export default exercises;