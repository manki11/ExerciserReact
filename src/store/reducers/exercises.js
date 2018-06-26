import {GET_ALL_EXERCISES, REMOVE_EXERCISE, ADD_NEW_EXERCISE, EDIT_EXERCISE, ADD_SCORE_TIME} from "../actionTypes";
import exercise from "../../seed.json";

const DEFAULT_STATE=[exercise];

const exercises = (state = DEFAULT_STATE, actions) => {
    switch (actions.type) {
        case GET_ALL_EXERCISES:
            return [...actions.exercise];
        case ADD_NEW_EXERCISE:
            return [actions.exercise, ...state];
        case EDIT_EXERCISE:
            return state.map((exercise, i) => {
                return exercise.id === actions.exercise.id ? actions.exercise : exercise
            });
        case REMOVE_EXERCISE:
            return state.filter(exercise => exercise.id !== actions.id);
        case ADD_SCORE_TIME:
            return state.map((exercise, i)=>{
                if(exercise.id=== actions.id){
                    let temp= exercise;
                    temp.scores.push(actions.score);
                    temp.times.push(actions.time);
                    return temp;
                }
                return exercise;
            });
        default:
            return state;
    }
};

export default exercises;