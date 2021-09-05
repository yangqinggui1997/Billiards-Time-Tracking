const START_LOADING = 'START_LOADING'
const STOP_LOADING = 'STOP_LOADING'

const startLoading = () => {
    return {type: START_LOADING}
}

const stopLoading = () => {
    return {type: STOP_LOADING}
}

export {
    START_LOADING,
    STOP_LOADING,
    startLoading,
    stopLoading
}
