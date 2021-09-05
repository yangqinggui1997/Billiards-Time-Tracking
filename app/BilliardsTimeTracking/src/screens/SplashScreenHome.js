import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { TryLocalLogin } from "../hooks/user"
import { startLoading } from "../stores/actions/general"

const SplashScreenHome = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '288066655191-t3bl8hthooo0vshn4607ha1pvm4ad85q.apps.googleusercontent.com',
    });
      dispatch(startLoading())
      TryLocalLogin(dispatch).catch(err => console.log(err))
  }, [])

  return null
}

export default SplashScreenHome
