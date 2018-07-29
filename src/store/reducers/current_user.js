import {SET_USER} from "../actionTypes";

const current_user=(state = {}, action)=> {
    switch (action.type) {
        case SET_USER:
            return action.user;
        default:
            return state
    }
};

export default current_user;