import { GameModel } from '../models/GameModel'
import {
  getFirstPlayerAfterButton,
  getActivePlayers
} from '../player-utilities'
import { PlayerModel } from '../models/PlayerModel'
import { PokerEngine } from '../poker-engine'

describe('Positioning', () => {
  let game: GameModel
  let engine: PokerEngine

  beforeEach(() => {
    game = new GameModel('123', {
      '1': new PlayerModel({ username: '1', playerId: '1', stack: 1000 }),
      '2': new PlayerModel({ username: '2', playerId: '2', stack: 1000 }),
      '3': new PlayerModel({ username: '3', playerId: '3', stack: 1000 })
    })
    game.gameStarted = true
    engine = new PokerEngine()
  })

  it('can find the first player after button if all players are active', () => {
    engine.setupRound(game)
    game.button = game.players['2']
    const activePlayers = getActivePlayers(game.players)
    const activePlayer = getFirstPlayerAfterButton(game, activePlayers)
    expect(activePlayer.playerId).toBe('3')
  })

  it('can find the first player after button if last player was button', () => {
    engine.setupRound(game)
    game.button = game.players['3']
    const activePlayers = getActivePlayers(game.players)
    const activePlayer = getFirstPlayerAfterButton(game, activePlayers)
    expect(activePlayer.playerId).toBe('1')
  })

  it('can find the first player after button if button isnt active', () => {
    engine.setupRound(game)
    game.button = game.players['2']
    engine.action(game, { playerId: '2', type: 'fold' })
    const activePlayers = getActivePlayers(game.players)
    const player = getFirstPlayerAfterButton(game, activePlayers)
    expect(player.playerId).toBe('3')
  })

  it('moves the button on new game', () => {
    game.button = game.players['1']
    engine.setupRound(game)
    expect(game.button.playerId).toBe('2')
    expect(game.round.currentPlayer.playerId).toBe('2')
  })

  it('moves the button on new game with 4 players', () => {
    game.players = {
      '1': new PlayerModel({ username: '1', playerId: '1', stack: 1000 }),
      '2': new PlayerModel({ username: '2', playerId: '2', stack: 1000 }),
      '3': new PlayerModel({ username: '3', playerId: '3', stack: 1000 }),
      '4': new PlayerModel({ username: '4', playerId: '4', stack: 1000 })
    }
    game.button = game.players['4']
    engine.setupRound(game)
    expect(game.button.playerId).toBe('1')
    expect(game.round.currentPlayer.playerId).toBe('4')
  })
})
