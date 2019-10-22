import * as firebase from 'react-native-firebase'

import { store } from '../configureStore'
import { gameUpdated } from '../store/game/actions'

export const buyIn = (amount: number) => {
  const { game, user } = store.getState()
  const player = game.players[user.playerId]
  const stack = +player.stack + Math.max(+amount, 0)
  player.stack = stack
  store.dispatch(gameUpdated(game))
  firebase
    .database()
    .ref(`/games/${game.gameId}/players/${user.playerId}`)
    .once('value', snapshot => snapshot.ref.update({ stack }))
}

export const setStack = (amount: number) => {
  const { game, user } = store.getState()
  const player = game.players[user.playerId]
  const stack = Math.max(+amount, 0)
  player.stack = stack
  store.dispatch(gameUpdated(game))
  firebase
    .database()
    .ref(`/games/${game.gameId}/players/${user.playerId}`)
    .once('value', snapshot => snapshot.ref.update({ stack }))
}
