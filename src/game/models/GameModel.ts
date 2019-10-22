import { PlayerModel } from './PlayerModel'
import { RoundModel } from './RoundModel'
import { BlindModel } from './BlindModel'
import { PlayerCollection } from './PlayerCollection'
import { Deck } from '../deck/models/deck'

export class GameModel {
  public deck: Deck
  public gameOwnerId: string
  public currentRound = 0
  public gameId: string
  public players: PlayerCollection = {}
  public button: PlayerModel
  public bigBlind: PlayerModel
  public round: RoundModel
  public gameStarted: boolean = false
  public firstRound: boolean = true
  public blinds: BlindModel = { big: 0, small: 0 }
  public maxPlayers = 10

  constructor(gameId: string, players: PlayerCollection) {
    this.gameId = gameId
    this.players = players
  }
}
