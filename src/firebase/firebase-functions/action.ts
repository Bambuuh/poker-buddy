import firebase from 'react-native-firebase'

import { ActionDataModel } from '../game/models/ActionDataModel'
import { PokerEngine } from '../game/poker-engine'

import { store } from '../configureStore'
import { gameUpdated } from '../store/game/actions'

const engine = new PokerEngine()

export const action = (actionData: ActionDataModel) => {
  const { game } = store.getState()
  engine.action(game, actionData)
  store.dispatch(gameUpdated(game))
  firebase
    .database()
    .ref(`/games/${game.gameId}`)
    .once('value', snapshot => snapshot.ref.update(game))
}
