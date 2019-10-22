import { GameHandler } from '../game-handler'
import { PlayerModel } from '../models/PlayerModel'

describe('GameHandler', () => {
  let gameHandler: GameHandler

  beforeEach(() => {
    gameHandler = new GameHandler()
  })

  describe('creating game', () => {
    it('adds player to game', () => {
      const game = gameHandler.createGame({
        username: 'username',
        id: '123',
        playerId: '1',
        avatarIndex: 0
      })
      expect(Object.keys(game.players).length).toBe(1)
      expect(game.players['1'].username).toBe('username')
      expect(game.gameOwnerId).toBe('1')
    })
  })

  describe('leaving game', () => {
    it('sets a new gameOwner', () => {
      const game = gameHandler.createGame({
        username: 'username',
        id: '123',
        playerId: '1',
        avatarIndex: 0
      })
      game.players['546'] = new PlayerModel({
        username: 'two',
        playerId: '546',
        stack: 400
      })
      gameHandler.leaveGame(game, '1')
      expect(game.gameOwnerId).toBe('546')
    })
  })
})
