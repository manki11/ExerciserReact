import {INCREMENT_ID} from "../actionTypes";

const exercise_counter=(state = 1, action)=> {
    switch (action.type) {
        case INCREMENT_ID:
            return state + 1;
        default:
            return state
    }
};

export default exercise_counter;