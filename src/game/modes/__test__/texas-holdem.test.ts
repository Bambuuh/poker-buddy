import { TexasHoldem } from '../texas-holdem'
import { GameModel } from '../../models/GameModel'
import { PlayerModel } from '../../models/PlayerModel'
import { RoundModel } from '../../models/RoundModel'

describe('TexasHoldem', () => {
  let texas: TexasHoldem

  let game: GameModel

  beforeEach(() => {
    game = new GameModel('123', {
      '1': new PlayerModel({ username: '1', playerId: '1', stack: 1000 }),
      '2': new PlayerModel({ username: '2', playerId: '2', stack: 1000 }),
      '3': new PlayerModel({ username: '3', playerId: '3', stack: 1000 })
    })
    texas = new TexasHoldem()
    game.round = new RoundModel(game.players, texas.streets)
  })

  it('should deal 2 cards per player', () => {
    texas.play(game)
    const twoCardsPerPlayer = Object.keys(game.players).every(
      playerId => game.players[playerId].cards.length === 2
    )
    expect(twoCardsPerPlayer).toBeTruthy()
  })

  it('should flop 3 cards', () => {
    texas.play(game)
    texas.play(game)
    expect(game.round.board.length).toBe(3)
  })

  it('should turn 1 cards', () => {
    texas.play(game)
    texas.play(game)
    texas.play(game)
    expect(game.round.board.length).toBe(4)
  })

  it('should river 1 cards', () => {
    texas.play(game)
    texas.play(game)
    texas.play(game)
    texas.play(game)
    expect(game.round.board.length).toBe(5)
  })

  it('should start over', () => {
    texas.play(game)
    texas.play(game)
    expect(game.round.currentStreet).toBe(2)
    texas.reset(game)
    expect(game.round.currentStreet).toBe(0)
  })

  it('should return current round', () => {
    const { street: firstStreet, action: firstAction } = texas.play(game)
    expect(firstStreet).toBe(1)
    expect(firstAction).toBe('new hand')
    const { street: secondStreet, action: secondAction } = texas.play(game)
    expect(secondStreet).toBe(2)
    expect(secondAction).toBe('flop')
    const { street: thirdStreet, action: thirdAction } = texas.play(game)
    expect(thirdStreet).toBe(3)
    expect(thirdAction).toBe('turn')
    const { street: fourthStreet, action: fourthAction } = texas.play(game)
    expect(fourthStreet).toBe(4)
    expect(fourthAction).toBe('river')
  })

  it('should not deal in offline players', () => {
    game = new GameModel('123', {
      '1': new PlayerModel({ username: '1', playerId: '1', stack: 1000 }),
      '2': new PlayerModel({ username: '2', playerId: '2', stack: 1000 }),
      '3': new PlayerModel({ username: '3', playerId: '3', stack: 1000 })
    })
    game.round = new RoundModel(game.players, texas.streets)
    game.players['1'].isOffline = true
    texas.play(game)
    expect(game.players['1'].cards).toBeUndefined()
  })

  it('should not deal in players wihout stack', () => {
    game = new GameModel('123', {
      '1': new PlayerModel({ username: '1', playerId: '1', stack: 0 }),
      '2': new PlayerModel({ username: '2', playerId: '2', stack: 1000 }),
      '3': new PlayerModel({ username: '3', playerId: '3', stack: 1000 })
    })
    game.round = new RoundModel(game.players, texas.streets)
    texas.play(game)
    expect(game.players['1'].cards).toBeUndefined()
  })
})
