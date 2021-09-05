import axiosInstance from '../api/axiosConfig'
import { signin as signinAction, signout as signoutAction, setError as setErrorAction, clearError as clearErrorAction } from '../stores/actions/user'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { navigate } from '../RootNavigation'
import { startLoading, stopLoading } from '../stores/actions/general'
import { LoginManager } from 'react-native-fbsdk'
import { GoogleSignin } from '@react-native-google-signin/google-signin'

const Signin = async (dispatch, params) => {
    dispatch(startLoading())
    let errorMessage = 'new Error'
    const response = await axiosInstance.post('/user/signin', {email: params.email, password: params.password}).catch(error => {
        if(error.response)
        {
            // Request made and server responded
            console.error(error.response.data)
            console.error(error.response.status)
            console.error(error.response.headers)
            dispatch(setErrorAction({errorMessage: error.response.data}))
            dispatch(stopLoading())
            errorMessage = error.response.data
        }
        else if(error.request)
        {
            console.error(error.request)
            dispatch(setErrorAction({errorMessage: error.request}))
            dispatch(stopLoading())
            errorMessage = error.request
        }
        else
        {
            dispatch(setErrorAction({errorMessage: error.message}))
            dispatch(stopLoading())
            console.error(error.message)
            errorMessage = error.message
        }
    })

    if(response)
    {
        await AsyncStorage.setItem('user', JSON.stringify({...response.data}))
        dispatch(signinAction({token: response.data.token, infors: response.data.infors}))
        dispatch(clearErrorAction())
        dispatch(stopLoading())
        navigate('RoutesScreen')
        console.log("Welcome back!")
        return Promise.resolve(true)
    }
    else
        return Promise.reject(new Error(errorMessage))
}

const SigninFacebook = async (dispatch, params) => {
    dispatch(startLoading())
    let errorMessage = 'new Error'
    const response = await axiosInstance.post('/user/signinFacebook', {email: params.email, facebookId: params.facebookId, name: params.name, avatar: params.avatar}).catch(error => {
        if(error.response)
        {
            // Request made and server responded
            console.error(error.response.data)
            console.error(error.response.status)
            console.error(error.response.headers)
            dispatch(setErrorAction({errorMessage: error.response.data}))
            dispatch(stopLoading())
            errorMessage = error.response.data
        }
        else if(error.request)
        {
            console.error(error.request)
            dispatch(setErrorAction({errorMessage: error.request}))
            dispatch(stopLoading())
            errorMessage = error.request
        }
        else
        {
            dispatch(setErrorAction({errorMessage: error.message}))
            dispatch(stopLoading())
            console.error(error.message)
            errorMessage = error.message
        }
    })

    if(response)
    {
        navigate('RoutesScreen')
        await AsyncStorage.setItem('user', JSON.stringify({...response.data}))
        dispatch(signinAction({token: response.data.token, infors: response.data.infors}))
        dispatch(clearErrorAction())
        dispatch(stopLoading())
        console.log("Welcome back!")
        return Promise.resolve(true)
    }
    else
        return Promise.reject(new Error(errorMessage))
}

const SigninGoogle = async (dispatch, params) => {
    dispatch(startLoading())
    let errorMessage = 'new Error'
    const response = await axiosInstance.post('/user/signinGoogle', {email: params.email, googleId: params.googleId, name: params.name, avatar: params.avatar}).catch(error => {
        if(error.response)
        {
            // Request made and server responded
            console.error(error.response.data)
            console.error(error.response.status)
            console.error(error.response.headers)
            dispatch(setErrorAction({errorMessage: error.response.data}))
            dispatch(stopLoading())
            errorMessage = error.response.data
        }
        else if(error.request)
        {
            console.error(error.request)
            dispatch(setErrorAction({errorMessage: error.request}))
            dispatch(stopLoading())
            errorMessage = error.request
        }
        else
        {
            dispatch(setErrorAction({errorMessage: error.message}))
            dispatch(stopLoading())
            console.error(error.message)
            errorMessage = error.message
        }  
    })

    if(response)
    {
        navigate('RoutesScreen')
        await AsyncStorage.setItem('user', JSON.stringify({...response.data}))
        dispatch(signinAction({token: response.data.token, infors: response.data.infors}))
        dispatch(clearErrorAction())
        dispatch(stopLoading())
        console.log("Welcome back!")
        return Promise.resolve(true)
    }
    else
        return Promise.reject(new Error(errorMessage))
}

const Signout = async (dispatch, typeLogin) => {
    let errorMessage = 'new Error'
    const user = await AsyncStorage.getItem("user")
    if(user)
    {
        const _user = JSON.parse(user)
        const response = await axiosInstance.put('/user/signout', {userId: _user.infors._id}).catch(error => {
            if(error.response)
            {
                // Request made and server responded
                console.error(error.response.data)
                console.error(error.response.status)
                console.error(error.response.headers)
                dispatch(setErrorAction({errorMessage: error.response.data}))
                errorMessage = error.response.data
            }
            else if(error.request)
            {
                console.error(error.request)
                dispatch(setErrorAction({errorMessage: error.request}))
                dispatch(stopLoading())
                errorMessage = error.request
            }
            else
            {
                dispatch(setErrorAction({errorMessage: error.message}))
                dispatch(stopLoading())
                console.error(error.message)
                errorMessage = error.message
            }
        })
        if(response)
        {
            navigate('AuthScreen')
            await AsyncStorage.clear()
            switch(typeLogin)
            {
                case 'facebook': 
                    await LoginManager.logOut()
                    break
                case 'google':
                    await GoogleSignin.revokeAccess()
                    await GoogleSignin.signOut()
                    break
                default: break
            }
            dispatch(signoutAction())
            console.log('See you again!')
            return Promise.resolve(true)
        }
        else
            return Promise.reject(new Error(errorMessage))
    }
    else
    {
        navigate('AuthScreen')
        await AsyncStorage.clear()   
        dispatch(signoutAction())
        console.log('See you again!')
        return Promise.resolve(true)
    }
}

const ClearErrorMessage = dispatch => {
    dispatch(clearErrorAction())
}

const TryLocalLogin = async dispatch => {
    const user = await AsyncStorage.getItem('user')
    if(user)
    {
        try
        {
            const userObj = JSON.parse(user)
            dispatch(signinAction({token: userObj.token, infors: userObj.infors, typeLogin: userObj.typeLogin}))
        }
        catch(error)
        {
            return Promise.reject(new Error(error.message))
        }
        
        navigate('RoutesScreen')
        console.log("Welcome back!")
    }
    else
    {
        navigate('AuthScreen')
        console.log("Please sign in!")
    }
    return Promise.resolve(true)
}

export {
    Signin,
    Signout,
    ClearErrorMessage,
    TryLocalLogin,
    SigninFacebook,
    SigninGoogle
}