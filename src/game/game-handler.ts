import { GameModel } from './models/GameModel'
import { CreateGameDataModel } from './models/CreateGameDataModel'
import { JoinAsPlayerModel } from './models/JoinGameDataModel'
import { PlayerModel } from './models/PlayerModel'
import { PokerEngine } from './poker-engine'

export class GameHandler {
  public engine = new PokerEngine()

  public leaveGame(game: GameModel, playerId: string) {
    const { players } = game
    players[playerId].isOffline = true
    const onlineIds = Object.keys(players).filter(id => !players[id].isOffline)
    if (onlineIds.length > 0) {
      game.gameOwnerId = players[onlineIds[0]].playerId
      this.engine.leaveGame(game, playerId)
    }
  }

  public initializeGame(game: GameModel) {
    game.gameStarted = true
    this.engine.setupRound(game)
  }

  public deal(game: GameModel) {
    this.engine.deal(game)
    game.firstRound = false
  }

  public createPlayer({ username, playerId, avatarIndex }: JoinAsPlayerModel) {
    return new PlayerModel({ username, avatarIndex, playerId })
  }

  public createGame({
    id,
    username,
    playerId,
    avatarIndex
  }: CreateGameDataModel) {
    const player = new PlayerModel({ username, avatarIndex, playerId })
    player.isFolded = true
    const game = new GameModel(id, {
      [playerId]: player
    })
    game.blinds = { small: 10, big: 20 }
    game.gameOwnerId = playerId
    return game
  }

  public startNewHand(game: GameModel) {
    const { round } = game
    round.board = []
    round.showdown = false
    round.currentStreet = 0
    const firstPlayerId = Object.keys(game.players)[0]
    round.currentPlayer = game.players[firstPlayerId]
    this.engine.start(game)
  }
}
