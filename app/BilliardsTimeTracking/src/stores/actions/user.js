const SIGN_IN = 'SIGN_IN'
const SIGN_OUT = 'SIGN_OUT'
const SET_ERROR = 'SET_ERROR'
const CLEAR_ERROR_MESSAGE = 'CLEAR_ERROR_MESSAGE'

const signin = payload => {
    return {type: SIGN_IN, payload}
}

const signout = () => {
    return {type: SIGN_OUT}
}

const setError = payload => {
    return {type: SET_ERROR, payload}
}

const clearError = () => {
    return {type: CLEAR_ERROR_MESSAGE}
}

export {
    SIGN_IN,
    SIGN_OUT,
    SET_ERROR,
    CLEAR_ERROR_MESSAGE,
    signin,
    signout,
    setError,
    clearError
}