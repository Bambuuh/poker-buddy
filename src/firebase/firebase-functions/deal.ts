import firebase from 'react-native-firebase'

import { GameHandler } from '../game/game-handler'
import { GameModel } from '../game/models/GameModel'
import { store } from '../configureStore'
import { gameUpdated } from '../store/game/actions'

const gameHandler = new GameHandler()

export const deal = () => {
  const { game } = store.getState()
  gameHandler.deal(game)
  store.dispatch(gameUpdated(game))
  firebase
    .database()
    .ref(`/games/${game.gameId}`)
    .once('value', snapshot => snapshot.ref.update(game))
}
