import auth from '@react-native-firebase/auth'

export async function loginAnonymosly() {
  return auth().signInAnonymously()
}
