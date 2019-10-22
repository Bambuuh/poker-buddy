import firebase from 'react-native-firebase'

import { GameHandler } from '../game/game-handler'
import { store } from '../configureStore'
import { gameUpdated } from '../store/game/actions'

const gameHandler = new GameHandler()

export const startNewHand = () => {
  const { game } = store.getState()
  gameHandler.startNewHand(game)
  store.dispatch(gameUpdated(game))
  return firebase
    .database()
    .ref(`/games/${game.gameId}`)
    .once('value', snapshot => snapshot.ref.update(game))
}
