import { START_LOADING, STOP_LOADING } from "../actions/general"


const initialSate = {
    isLoading: false
}

const generalReducer = (state = initialSate, action) => {
    switch(action.type)
    {
        case START_LOADING:
            return {...state, isLoading: true}
        case STOP_LOADING:
            return {...state, isLoading: false}
        default:
            return state
    }
}

export default generalReducer