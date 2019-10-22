import { GameModel } from '../models/GameModel'
import { dividePot } from '../pot-utilities'
import { Card } from '../deck/models/card'
import { PlayerModel } from '../models/PlayerModel'
import { PokerEngine } from '../poker-engine'
import { Winner } from '../../store/types'

describe('Pot', () => {
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

  it('divides between all winners', () => {
    engine.setupRound(game)
    game.round.pots = [
      {
        amount: 200,
        players: game.players,
        winners: [
          { id: '1', handScore: undefined },
          { id: '2', handScore: undefined }
        ]
      }
    ]
    game.players['1'].cards = [new Card('heart', 14), new Card('spade', 14)]
    game.players['2'].cards = [new Card('club', 14), new Card('diamond', 14)]
    game.players['3'].cards = [new Card('diamond', 11), new Card('spade', 11)]
    game.round.board = [
      new Card('heart', 4),
      new Card('club', 5),
      new Card('club', 6),
      new Card('heart', 7),
      new Card('diamond', 7)
    ]
    dividePot(game)
    expect(game.players['1'].stack).toBe(1100)
    expect(game.players['2'].stack).toBe(1100)
    expect(game.players['3'].stack).toBe(1000)
  })

  it('gives leftover to first active after button', () => {
    game.players = {
      '1': new PlayerModel({ username: '1', playerId: '1', stack: 1000 }),
      '2': new PlayerModel({ username: '2', playerId: '2', stack: 1000 }),
      '3': new PlayerModel({ username: '3', playerId: '3', stack: 1000 }),
      '4': new PlayerModel({ username: '4', playerId: '4', stack: 1000 }),
      '5': new PlayerModel({ username: '5', playerId: '5', stack: 1000 }),
      '6': new PlayerModel({ username: '6', playerId: '6', stack: 1000 })
    }
    engine.setupRound(game)
    const winners: Winner[] = [
      { id: '1', handScore: undefined },
      { id: '2', handScore: undefined },
      { id: '4', handScore: undefined }
    ]
    game.button = game.players['3']
    game.round.pots = [{ amount: 301, players: game.players, winners }]
    game.players['1'].cards = [new Card('heart', 14), new Card('spade', 2)]
    game.players['2'].cards = [new Card('club', 14), new Card('diamond', 2)]
    game.players['3'].cards = [new Card('diamond', 11), new Card('spade', 11)]
    game.players['4'].cards = [new Card('diamond', 14), new Card('spade', 9)]
    game.players['5'].cards = [new Card('diamond', 12), new Card('spade', 12)]
    game.players['6'].cards = [new Card('diamond', 10), new Card('spade', 10)]
    game.round.board = [
      new Card('heart', 4),
      new Card('club', 5),
      new Card('club', 6),
      new Card('heart', 7),
      new Card('diamond', 14)
    ]
    dividePot(game)
    expect(game.players['1'].stack).toBe(1100)
    expect(game.players['2'].stack).toBe(1100)
    expect(game.players['3'].stack).toBe(1000)
    expect(game.players['4'].stack).toBe(1101)
    expect(game.players['5'].stack).toBe(1000)
    expect(game.players['6'].stack).toBe(1000)
  })

  it('can handle headsup', () => {
    game.players = {
      '1': new PlayerModel({ username: '1', playerId: '1', stack: 1000 }),
      '2': new PlayerModel({ username: '2', playerId: '2', stack: 1000 })
    }
    engine.setupRound(game)
    game.players['1'].cards = [new Card('heart', 3), new Card('spade', 3)]
    game.players['2'].cards = [new Card('heart', 2), new Card('spade', 2)]
    game.round.board = [
      new Card('heart', 4),
      new Card('heart', 5),
      new Card('heart', 6),
      new Card('heart', 7),
      new Card('diamond', 7)
    ]
    game.round.pots = [
      {
        amount: 200,
        players: game.players,
        winners: [{ id: '1', handScore: undefined }]
      }
    ]
    dividePot(game)
    expect(game.players['1'].stack).toBe(1200)
    expect(game.players['2'].stack).toBe(1000)
  })

  it('to winner', () => {
    engine.setupRound(game)
    game.round.pots = [
      {
        amount: 200,
        players: game.players,
        winners: [{ id: '1', handScore: undefined }]
      }
    ]
    game.players['1'].cards = [new Card('heart', 3), new Card('spade', 3)]
    game.players['2'].cards = [new Card('heart', 2), new Card('spade', 2)]
    game.players['3'].cards = [new Card('heart', 11), new Card('spade', 11)]
    game.round.board = [
      new Card('heart', 4),
      new Card('heart', 5),
      new Card('heart', 6),
      new Card('heart', 7),
      new Card('diamond', 7)
    ]
    dividePot(game)
    expect(game.players['1'].stack).toBe(1200)
    expect(game.players['2'].stack).toBe(1000)
    expect(game.players['3'].stack).toBe(1000)
  })

  it('can handle regular board', () => {
    game = new GameModel('123', {
      '1': new PlayerModel({ username: '1', playerId: '1', stack: 1000 }),
      '2': new PlayerModel({ username: '2', playerId: '2', stack: 1000 })
    })
    engine.setupRound(game)
    game.players['1'].cards = [new Card('spade', 5), new Card('diamond', 5)]
    game.players['2'].cards = [new Card('diamond', 7), new Card('diamond', 11)]
    game.round.board = [
      new Card('club', 3),
      new Card('club', 7),
      new Card('spade', 10),
      new Card('spade', 3),
      new Card('spade', 7)
    ]
    game.round.pots = [
      {
        amount: 300,
        players: game.players,
        winners: undefined
      }
    ]
    dividePot(game)
    expect(game.players['1'].stack).toBe(1000)
    expect(game.players['2'].stack).toBe(1300)
  })

  it('can handle side pots with losing short stack', () => {
    game = new GameModel('123', {
      '1': new PlayerModel({ username: '1', playerId: '1', stack: 1000 }),
      '2': new PlayerModel({ username: '2', playerId: '2', stack: 1000 }),
      '3': new PlayerModel({ username: '3', playerId: '3', stack: 200 })
    })
    engine.setupRound(game)
    game.players['1'].cards = [new Card('heart', 3), new Card('spade', 3)]
    game.players['2'].cards = [new Card('heart', 2), new Card('spade', 2)]
    game.players['3'].cards = [new Card('heart', 11), new Card('spade', 11)]
    game.round.board = [
      new Card('heart', 4),
      new Card('heart', 5),
      new Card('heart', 6),
      new Card('heart', 7),
      new Card('diamond', 7)
    ]
    game.round.pots = [
      {
        amount: 300,
        players: game.players,
        winners: [{ id: '1', handScore: undefined }]
      },
      {
        amount: 400,
        players: { '1': game.players['1'], '2': game.players['2'] },
        winners: [{ id: '1', handScore: undefined }]
      }
    ]
    dividePot(game)
    expect(game.players['1'].stack).toBe(1700)
    expect(game.players['2'].stack).toBe(1000)
    expect(game.players['3'].stack).toBe(200)
  })

  it('can handle side pots with winning short stack', () => {
    game = new GameModel('123', {
      '1': new PlayerModel({ username: '1', playerId: '1', stack: 1000 }),
      '2': new PlayerModel({ username: '2', playerId: '2', stack: 1000 }),
      '3': new PlayerModel({ username: '3', playerId: '3', stack: 200 })
    })
    engine.setupRound(game)
    game.players['1'].cards = [new Card('heart', 2), new Card('spade', 11)]
    game.players['2'].cards = [new Card('heart', 11), new Card('spade', 2)]
    game.players['3'].cards = [new Card('heart', 3), new Card('spade', 3)]
    game.round.board = [
      new Card('heart', 4),
      new Card('heart', 5),
      new Card('heart', 6),
      new Card('heart', 7),
      new Card('diamond', 7)
    ]
    game.round.pots = [
      { amount: 300, players: game.players, winners: [] },
      {
        amount: 400,
        players: { '1': game.players['1'], '2': game.players['2'] },
        winners: []
      }
    ]
    dividePot(game)
    expect(game.players['1'].stack).toBe(1000)
    expect(game.players['2'].stack).toBe(1400)
    expect(game.players['3'].stack).toBe(500)
  })
})
