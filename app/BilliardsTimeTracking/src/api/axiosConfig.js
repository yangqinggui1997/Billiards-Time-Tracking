import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: 'http://c4a2-115-77-215-185.ngrok.io'
})

axiosInstance.interceptors.request.use(
    async(config) => {
        const user = await AsyncStorage.getItem('user')
        if(user)
        {
            const userObj = JSON.parse(user)
            config.headers.Authorization = `Bearer ${userObj.token}`
        }
        return config
    },
    (err) => {
        return Promise.reject(err)
    }
)

export default axiosInstance