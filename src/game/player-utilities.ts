import { PlayerModel } from './models/PlayerModel'
import { PlayerCollection } from './models/PlayerCollection'
import { GameModel } from './models/GameModel'

const getOnlinePlayers = (players: PlayerCollection) => {
  const onlinePlayers: PlayerCollection = {}
  Object.keys(players).forEach(playerId => {
    if (!players[playerId].isOffline) {
      onlinePlayers[playerId] = players[playerId]
    }
  })
  return onlinePlayers
}

export const getNextPlayer = (
  players: PlayerCollection,
  player: PlayerModel
) => {
  const keys = Object.keys(players)
  const nextIndex = keys.findIndex(playerId => playerId === player.playerId) + 1
  if (nextIndex >= keys.length) {
    return players[keys[0]]
  } else {
    return players[keys[nextIndex]]
  }
}

export const getPlayersFromGameModel = (
  game: GameModel,
  players: PlayerCollection
) => {
  const gameModelPlayers: PlayerCollection = {}
  Object.keys(players).forEach(id => (gameModelPlayers[id] = game.players[id]))
  return gameModelPlayers
}

export const getNextOnlinePlayer = (
  players: PlayerCollection,
  player: PlayerModel
) => {
  const onlinePlayers = getOnlinePlayers(players)
  return getNextPlayer(onlinePlayers, player)
}

export const getActivePlayers = (players: PlayerCollection) => {
  const activePlayers: PlayerCollection = {}
  Object.keys(players).forEach(playerId => {
    if (!players[playerId].isFolded) {
      activePlayers[playerId] = players[playerId]
    }
  })
  return activePlayers
}

export const getPlayersWithStack = (players: PlayerCollection) => {
  const playersWithStack: PlayerCollection = {}
  Object.keys(players).forEach(playerID => {
    if (players[playerID].stack > 0) {
      playersWithStack[playerID] = players[playerID]
    }
  })
  return playersWithStack
}

export const getNextPlayerWithStack = (
  players: PlayerCollection,
  player: PlayerModel
) => {
  const playersWithStack = getPlayersWithStack(players)
  return getNextPlayer(playersWithStack, player)
}

export const getNextActivePlayer = (
  players: PlayerCollection,
  player: PlayerModel
) => {
  const activePlayers = getActivePlayers(players)
  return getNextPlayer(activePlayers, player)
}

export const getNextActivePlayerWithStackOrActionHolder = (
  game: GameModel,
  player: PlayerModel
) => {
  const { round, players } = game
  let firstActivePlayerWithStack: PlayerModel
  const allPlayerKeys = Object.keys(players)
  let currentPlayer = player
  while (!firstActivePlayerWithStack) {
    const index = allPlayerKeys.findIndex(
      playerId => playerId === currentPlayer.playerId
    )
    let nextIndex = index + 1
    if (nextIndex === allPlayerKeys.length) {
      nextIndex = 0
    }
    const nextPlayer = players[allPlayerKeys[nextIndex]]
    if (
      (nextPlayer.stack > 0 && !nextPlayer.isFolded) ||
      round.actionHolder.playerId === nextPlayer.playerId
    ) {
      firstActivePlayerWithStack = nextPlayer
    }
    currentPlayer = nextPlayer
  }
  return firstActivePlayerWithStack
}

export const getFirstPlayerAfterButton = (
  game: GameModel,
  filteredPlayers: PlayerCollection
): PlayerModel => {
  const { players, button } = game
  const filteredKeys = Object.keys(filteredPlayers)
  const playerKeys = Object.keys(players)
  let player = button
  if (filteredKeys.length === 1) {
    return players[filteredKeys[0]]
  }
  let firstActivePlayer: PlayerModel
  while (!firstActivePlayer) {
    const index = playerKeys.findIndex(playerId => playerId === player.playerId)
    let nextIndex = index + 1
    if (nextIndex === playerKeys.length) {
      nextIndex = 0
    }
    const nextPlayer = players[playerKeys[nextIndex]]
    const nextActivePlayer = filteredPlayers[nextPlayer.playerId]
    if (nextActivePlayer) {
      firstActivePlayer = nextActivePlayer
    }
    player = nextPlayer
  }
  return firstActivePlayer
}
