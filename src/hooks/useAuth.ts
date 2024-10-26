import { useState, useEffect } from 'react'
import { AuthService } from '../services/AuthService'
import { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { IFirestoreUser } from '../types/User'
import { apiFunctions } from '../services/apiFunctions'

export const useAuth = () => {
  const [user, setUser] = useState<IFirestoreUser | null>(null)
  const [loadingAuth, setLoadingAuth] = useState(true)

  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChanged((userData) => {
      if (userData) {
        setUser(userData)
      } else {
        setUser(null)
      }
      setLoadingAuth(false)
    })
    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setLoadingAuth(true)
      const authResponse: FirebaseAuthTypes.User = await apiFunctions.loginUser(email, password)
      const userObject: IFirestoreUser = await apiFunctions.getUser(authResponse.uid)
      setUser(userObject)
    } catch (error: any) {
      throw new Error(`Error logging in auth process: ${error.message}`)
    } finally {
      setLoadingAuth(false)
    }
  }

  const logout = async () => {
    await AuthService.logoutUser()
    setUser(null)
  }

  return { user, login, logout, loadingAuth }
}
