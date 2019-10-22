import firestore from '@react-native-firebase/firestore'
import { Game } from './types'
import { store } from '../../redux'

const ref = firestore().collection('games')

export async function createGame() {
  try {
    console.log('creating game')
    const newGame: Omit<Game, 'id'> = {
      players: [store.getState().user.id]
    }
    const result = await ref.add(newGame)
    return { ...newGame, id: result.id }
  } catch (error) {
    throw error
  }
}

export function getGames() {
  return ref.get()
}
