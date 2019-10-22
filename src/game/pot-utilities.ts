import { HandCompare } from './hand-compare'
import {
  getFirstPlayerAfterButton,
  getActivePlayers,
  getPlayersFromGameModel
} from './player-utilities'
import { GameModel } from './models/GameModel'
import { PlayerCollection } from './models/PlayerCollection'
import { Card } from './deck/models/card'
import { PotModel } from './models/PotModel'
import { HandScoreModel } from './models/HandScoreModel'
import { PlayerModel } from './models/PlayerModel'

const handCompare = new HandCompare()

export const getWinners = (board: Card[], players: PlayerCollection) => {
  let winners: { id: string; handScore: HandScoreModel }[] = []
  const ids = Object.keys(players)
  if (ids.length === 1) {
    return [{ id: players[ids[0]].playerId, handScore: undefined }]
  }
  ids.forEach(id => {
    const player = players[id]
    if (!player.cards || player.cards.length === 0) {
      player.handScore = { highCard: 0, highHand: 0, score: 0 }
    } else {
      player.handScore = handCompare.getScore(player.cards, board)
    }
    const { playerId, handScore } = player
    const winner = winners[0]
    if (winners.length === 0) {
      winners.push({ id: playerId, handScore })
    } else if (handScore.score > winner.handScore.score) {
      winners = [{ id: playerId, handScore }]
    } else if (handScore.score === winner.handScore.score) {
      if (handScore.highCard > winner.handScore.highCard) {
        winners = [{ id: playerId, handScore }]
      } else if (handScore.highCard === winner.handScore.highCard) {
        if (handScore.highHand > winner.handScore.highHand) {
          winners = [{ id: playerId, handScore }]
        } else if (player.handScore.highHand === winner.handScore.highHand) {
          winners.push({ id: playerId, handScore })
        }
      }
    }
  })
  return winners
}

export const dividePot = (game: GameModel) => {
  const { round, players } = game
  round.pots.forEach(pot => {
    const playersInPot = getPlayersFromGameModel(game, pot.players)
    pot.winners = getWinners(round.board, playersInPot)
    const splits = pot.winners.length
    pot.winners.forEach(winner => {
      const player = players[winner.id]
      player.stack += Math.floor(pot.amount / splits)
    })
    const rest = pot.amount % splits
    const activePlayers = getActivePlayers(game.players)
    const activePlayer = getFirstPlayerAfterButton(game, activePlayers)
    activePlayer.stack += rest
  })
}

export const getActivePlayersWithStack = (game: GameModel) => {
  const { players } = game
  const activePlayersWithStack: PlayerCollection = {}
  Object.keys(game.players).forEach(id => {
    if (players[id].stack > 0 && !players[id].isFolded) {
      activePlayersWithStack[id] = players[id]
    }
  })
  return activePlayersWithStack
}

export const collectPot = (game: GameModel) => {
  const { round, players } = game
  const playerKeys = Object.keys(round.pots[round.pots.length - 1].players)
  let idsOrderedByLowest = playerKeys.sort((a, b) => {
    if (players[a].stake < players[b].stake) {
      return -1
    } else if (players[a].stake > players[b].stake) {
      return 1
    } else {
      return 0
    }
  })

  while (idsOrderedByLowest.length > 0) {
    const playerIdsWithStake = idsOrderedByLowest.filter(
      id => players[id].stake > 0
    )
    const playerId = idsOrderedByLowest[0]
    const player = players[playerId]
    if (playerIdsWithStake.length === 1) {
      const lastPlayer = players[playerIdsWithStake[0]]
      lastPlayer.stack += lastPlayer.stake
      lastPlayer.stake = 0
      if (Object.keys(getActivePlayers(game.players)).length === 1) {
        lastPlayer.stack += round.pots[round.pots.length - 1].amount
        round.pots.pop()
        idsOrderedByLowest = []
      }
    } else {
      if (player.isFolded) {
        round.pots[round.pots.length - 1].amount += player.stake
        player.stake = 0
        idsOrderedByLowest = idsOrderedByLowest.filter(
          id => players[id].playerId !== playerId
        )
        delete round.pots[round.pots.length - 1].players[playerId]
      } else {
        const amount = player.stake
        const playerIdsInPot = Object.keys(
          round.pots[round.pots.length - 1].players
        )
        playerIdsInPot.forEach(id => {
          round.pots[round.pots.length - 1].amount += amount
          players[id].stake -= amount
        })
      }
    }

    const playerIdsWithStakeAfterCollect = idsOrderedByLowest.filter(
      id => players[id].stake > 0
    )
    if (!player.isFolded && playerIdsWithStakeAfterCollect.length > 1) {
      const playersWithStakeAfterCollect: PlayerCollection = playerIdsWithStakeAfterCollect.reduce(
        (obj: PlayerCollection, id) => {
          obj[id] = players[id]
          return obj
        },
        {}
      )
      round.pots.push(new PotModel(playersWithStakeAfterCollect))
    }
    idsOrderedByLowest = playerIdsWithStakeAfterCollect
  }
}
