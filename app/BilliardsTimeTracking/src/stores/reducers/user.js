import { SET_ERROR, SIGN_IN, SIGN_OUT, CLEAR_ERROR_MESSAGE } from '../actions/user'

const initialSate = {
    token: null,
    infors: null,
    errorMessage: ''
}

const userReducer = (state = initialSate, action) => {
    switch(action.type)
    {
        case SIGN_IN: 
            return {errorMessage: '', token: action.payload.token, infors: action.payload.infors}
        case SIGN_OUT: 
            return {errorMessage: '', token: null, infors: null}
        case SET_ERROR:
            return {...state, errorMessage: action.payload.errorMessage}
        case CLEAR_ERROR_MESSAGE:
            return {...state, errorMessage: ''}
        default:
            return state
    }
}

export default userReducer