import {IS_HOST} from "../../actionTypes";

const isHost=(state = true, action)=> {
    switch (action.type) {
        case IS_HOST:
            return true;
        default:
            return state
    }
};

export default isHost;