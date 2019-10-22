import firebase from 'react-native-firebase'

import { GameHandler } from '../game/game-handler'
import { store } from '../configureStore'
import { gameUpdated } from '../store/game/actions'

const gameHandler = new GameHandler()

export const startGame = () => {
  const { game } = store.getState()
  gameHandler.initializeGame(game)
  store.dispatch(gameUpdated(game))
  firebase
    .database()
    .ref(`/games/${game.gameId}`)
    .once('value', snapshot => snapshot.ref.update(game))
}
