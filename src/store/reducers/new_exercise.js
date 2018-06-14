import {ADD_NEW_EXERCISE_TYPE, ADD_NEW_EXERCISE_QUES, ADD_NEW_EXERCISE_ID} from "../actionTypes";

const DEFAULT_STATE={
    id:-1,
    type:"",
    scores:[],
    questions:[]
};

const new_exercise=(state=DEFAULT_STATE, actions)=> {
    switch(actions.type){
        case ADD_NEW_EXERCISE_TYPE:
            return {...state, type:actions.type};
        case ADD_NEW_EXERCISE_QUES:
            return {...state, questions:[...state.questions, actions.question]};
        case ADD_NEW_EXERCISE_ID:
            return {...state, id: actions.id};
        default:
            return state;
    }
};

export default new_exercise;