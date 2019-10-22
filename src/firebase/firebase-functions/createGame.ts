// import { GameHandler } from '../game/game-handler'
// import { store } from '../configureStore'
// import firebase from 'react-native-firebase'
// import { gameUpdated } from '../store/game/actions'

import firestore from '@react-native-firebase/firestore'

// const gameHandler = new GameHandler()

export const getUniqueId = () =>
  Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()

export async function test() {
  firestore().collection('game').
}

export const createGame = async () => {
  const { username, avatarIndex, playerId } = store.getState().user
  let idIsUnique = false
  let result

  try {
    while (!idIsUnique) {
      const id = getUniqueId()

      result = await firebase
        .database()
        .ref(`/games/${id}`)
        .once('value', snapshot => {
          if (!snapshot.exists()) {
            idIsUnique = true
            const game = gameHandler.createGame({
              username,
              playerId,
              id,
              avatarIndex
            })
            store.dispatch(gameUpdated(game))
            try {
              snapshot.ref.parent.update({ [id]: game })
            } catch (err) {
              console.log(err)
            }
            return game
          }
        })
    }
  } catch (err) {
    console.log(err)
  }
  return result
}
