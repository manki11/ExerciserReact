import {ADD_USER, REMOVE_USER} from "../../actionTypes";

const users=(state = [], action)=> {
    switch (action.type) {
        case ADD_USER:
            return [...state, action.user];
        case REMOVE_USER:
            return state.filter(user => user !== action.user);
        default:
            return state
    }
};

export default users;