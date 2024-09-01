import auth from '@react-native-firebase/auth'

export const AuthService = {
  registerUser: async (email: string, password: string) => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password)
      return userCredential.user
    } catch (error: any) {
      throw new Error(`Error registering user: ${error.message}`)
    }
  },

  loginUser: async (email: string, password: string) => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password)
      return userCredential.user
    } catch (error: any) {
      throw new Error(`Error logging in: ${error.message}`)
    }
  },

  logoutUser: async () => {
    try {
      await auth().signOut()
    } catch (error: any) {
      throw new Error(`Error logging out: ${error.message}`)
    }
  },

  getCurrentUser: () => {
    return auth().currentUser
  },

  resetPassword: async (email: string) => {
    try {
      await auth().sendPasswordResetEmail(email)
    } catch (error: any) {
      throw new Error(`Error sending password reset email: ${error.message}`)
    }
  },

  onAuthStateChanged: (callback: (user: any) => void) => {
    return auth().onAuthStateChanged(callback)
  },
}
