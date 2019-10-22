import firebase from 'react-native-firebase'

import { GameHandler } from '../game/game-handler'
import { store } from '../configureStore'

const handler = new GameHandler()

export const leaveGame = () => {
  const { game, user } = store.getState()
  return firebase
    .database()
    .ref(`/games/${game.gameId}`)
    .once('value', snapshot => {
      const game = snapshot.val()
      handler.leaveGame(game, user.playerId)
      return snapshot.ref.update(game)
    })
}
