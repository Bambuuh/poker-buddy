import firebase from 'react-native-firebase'

import { GameHandler } from '../game/game-handler'
import { GameModel } from '../game/models/GameModel'
import { store } from '../configureStore'
import { gameUpdated } from '../store/game/actions'
import { DataSnapshot } from 'react-native-firebase/database'

const gameHandler = new GameHandler()

export const joinAsPlayer = async (gameId: string): Promise<GameModel> => {
  const { username, avatarIndex, playerId } = store.getState().user
  return new Promise((resolve, reject) => {
    firebase
      .database()
      .ref(`/games/${gameId}`)
      .once('value', async (snapshot: DataSnapshot) => {
        if (!snapshot.exists()) {
          return reject(new Error('game_not_found'))
        }
        const game: GameModel = snapshot.val()
        const amountOfPlayers = Object.keys(game.players).length
        if (amountOfPlayers >= game.maxPlayers) {
          return reject(new Error('game_is_full'))
        }
        if (game.players[playerId]) {
          snapshot
            .child(`players/${playerId}`)
            .ref.update({ isOffline: false, username })
            .then(() => {
              firebase
                .database()
                .ref(`/games/${gameId}`)
                .once('value', async (snapshot: DataSnapshot) => {
                  const game = snapshot.val()
                  store.dispatch(gameUpdated(game))
                  return resolve(game)
                })
            })
        } else {
          const player = gameHandler.createPlayer({
            username,
            playerId,
            avatarIndex
          })
          player.isFolded = true
          snapshot
            .child(`/players`)
            .ref.update({ [playerId]: player })
            .then(() => {
              firebase
                .database()
                .ref(`/games/${gameId}`)
                .once('value', async (snapshot: DataSnapshot) => {
                  const game = snapshot.val()
                  store.dispatch(gameUpdated(game))
                  return resolve(game)
                })
            })
        }
      })
  })
}
