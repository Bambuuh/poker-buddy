import { TexasHoldem } from './modes/texas-holdem'
import { HandCompare } from './hand-compare'
import { RoundModel } from './models/RoundModel'
import {
  getFirstPlayerAfterButton,
  getNextActivePlayerWithStackOrActionHolder,
  getActivePlayers,
  getPlayersWithStack,
  getNextOnlinePlayer,
  getNextPlayer
} from './player-utilities'
import {
  dividePot,
  getActivePlayersWithStack,
  collectPot
} from './pot-utilities'
import { PlayerModel } from './models/PlayerModel'
import { GameModel } from './models/GameModel'
import { ActionDataModel } from './models/ActionDataModel'

export class PokerEngine {
  public handCompare = new HandCompare()
  public texasHoldem = new TexasHoldem()

  public start(game: GameModel) {
    this.setupRound(game)
    this.deal(game)
  }

  public setupRound(game: GameModel) {
    const { button, players } = game
    Object.keys(players).forEach(playerId => {
      const player = players[playerId]
      const hasStack = player.stack > 0
      player.isFolded = !hasStack
      player.cards = []
    })
    const playersWithStack = getPlayersWithStack(players)
    game.round = new RoundModel(playersWithStack, this.texasHoldem.streets)
    if (button) {
      game.button = getNextOnlinePlayer(playersWithStack, button)
    } else {
      const firstPlayerId = Object.keys(playersWithStack)[0]
      game.button = playersWithStack[firstPlayerId]
    }
    this.setBlinds(game)
  }

  public deal(game: GameModel) {
    this.texasHoldem.reset(game)
    this.texasHoldem.play(game)
  }

  public action(game: GameModel, action: ActionDataModel) {
    const { round, players } = game
    this.doAction(game, action)
    round.currentPlayer = getNextActivePlayerWithStackOrActionHolder(
      game,
      round.currentPlayer
    )

    const activePlayers = getActivePlayers(players)
    const currentPlayerIsActionHolder =
      round.currentPlayer.playerId === round.actionHolder.playerId
    const onePlayerRemaining = Object.keys(activePlayers).length === 1

    if (currentPlayerIsActionHolder || onePlayerRemaining) {
      const playersWithStack = getPlayersWithStack(activePlayers)
      const playerPool =
        Object.keys(playersWithStack).length > 0
          ? playersWithStack
          : activePlayers
      round.currentPlayer = getFirstPlayerAfterButton(game, playerPool)
      round.actionHolder = round.currentPlayer
      collectPot(game)
      this.nextStreet(game)
    }
    if (round.currentPlayer.isOffline) {
      this.doOfflineAction(game)
    }
  }

  public doOfflineAction(game: GameModel) {
    const { currentPlayer } = game.round
    if (currentPlayer.stake < game.round.toCall) {
      this.action(game, { type: 'fold', playerId: currentPlayer.playerId })
    } else {
      this.action(game, { playerId: currentPlayer.playerId, type: 'check' })
    }
  }

  public doAction(game: GameModel, action: ActionDataModel) {
    const { type, playerId, amount } = action
    if (!game.round.history) {
      game.round.history = []
    }
    if (type === 'bet') {
      this.bet(game, playerId, amount)
    } else if (type === 'raise') {
      this.raise(game, playerId, amount)
    } else if (type === 'call') {
      this.call(game, playerId)
    } else if (type === 'fold') {
      this.fold(game, playerId)
    } else {
      this.check(game, playerId)
    }
  }

  public check(game: GameModel, playerId: string) {
    game.round.history.push({
      action: 'check',
      id: playerId,
      cards: game.players[playerId].cards
    })
  }

  public bet(game: GameModel, playerId: string, amount: number) {
    const { round, players } = game
    const player = players[playerId]
    this.setStake(game, playerId, amount)
    round.toCall = amount
    round.history.push({
      action: 'bet',
      id: playerId,
      amount,
      cards: player.cards
    })
    round.actionHolder = player
  }

  public raise(game: GameModel, playerId: string, amount: number) {
    let raiseAmount = amount
    const { round, players } = game
    const player = players[playerId]
    const total = player.stack + player.stake
    if (raiseAmount >= total) {
      raiseAmount = total
    }
    this.setStake(game, playerId, raiseAmount)
    round.toCall = raiseAmount
    round.history.push({
      action: 'raise',
      id: playerId,
      amount: raiseAmount,
      cards: player.cards
    })
    round.actionHolder = player
  }

  public setStake(game: GameModel, playerId: string, amount: number) {
    const { players } = game
    const player = players[playerId]
    const addedAmount =
      Math.max(amount, player.stake) - Math.min(amount, player.stake)
    player.stake += addedAmount
    player.stack -= addedAmount
  }

  public call(game: GameModel, playerId: string) {
    const { round, players } = game
    const player = players[playerId]
    let amount = round.toCall
    const total = player.stack + player.stake
    if (amount >= total) {
      amount = total
    }
    this.setStake(game, playerId, amount)
    game.round.history.push({
      action: 'call',
      id: playerId,
      amount: round.toCall,
      cards: player.cards
    })
  }

  public fold(game: GameModel, playerId: string) {
    const { round, players } = game
    const player = players[playerId]
    round.history.push({ action: 'fold', id: playerId, cards: player.cards })
    player.cards = []
    player.isFolded = true
  }

  public nextStreet(game: GameModel) {
    const { round, players } = game
    round.toCall = 0
    const activePlayers = getActivePlayers(players)
    const activePlayerIds = Object.keys(activePlayers)
    if (activePlayerIds.length > 1 && round.currentStreet <= round.streets) {
      const playersWithStack = getActivePlayersWithStack(game)
      if (Object.keys(playersWithStack).length < 2) {
        for (let i = round.currentStreet; i <= round.streets; i++) {
          const { street, action } = this.texasHoldem.play(game)
          round.currentStreet = street
          round.history.push({ action, cards: round.board })
        }
        dividePot(game)
        round.showdown = true
      } else {
        const { street, action } = this.texasHoldem.play(game)
        round.currentStreet = street
        round.history.push({ action, cards: round.board })
      }
    } else {
      dividePot(game)
      round.showdown = true
    }
  }

  public setBlinds(game: GameModel) {
    const { players, blinds, round } = game
    let smallBlind: PlayerModel
    let bigBlind: PlayerModel
    const playersWithStack = getPlayersWithStack(players)
    if (Object.keys(playersWithStack).length > 2) {
      smallBlind = getNextPlayer(playersWithStack, game.button)
      bigBlind = getNextPlayer(playersWithStack, smallBlind)
    } else {
      smallBlind = game.button
      bigBlind = getNextPlayer(playersWithStack, smallBlind)
    }
    round.currentPlayer = getNextPlayer(playersWithStack, bigBlind)
    round.actionHolder = round.currentPlayer

    smallBlind.stake = blinds.small
    smallBlind.stack -= blinds.small

    game.bigBlind = bigBlind
    bigBlind.stake = blinds.big
    bigBlind.stack -= blinds.big

    round.toCall = blinds.big
  }

  public leaveGame(game: GameModel, playerId: string) {
    const { round, players } = game
    const player = players[playerId]
    player.isOffline = true
    if (!round) {
      return
    }
    if (
      Object.keys(getActivePlayers(players)).length > 1 &&
      !player.isFolded &&
      !round.showdown
    ) {
      if (round.currentPlayer && round.currentPlayer.playerId === playerId) {
        if (player.stake < round.toCall) {
          this.action(game, { playerId, type: 'fold' })
        } else {
          this.action(game, { playerId, type: 'check' })
        }
      }
    }
  }
}
