import {IS_SHARED} from "../../actionTypes";

const isShared=(state = true, action)=> {
    switch (action.type) {
        case IS_SHARED:
            return true;
        default:
            return state
    }
};

export default isShared;