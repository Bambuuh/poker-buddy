import { HistoryModel } from './HistoryModel'
import { Card } from '../deck/models/card'
import { PotModel } from './PotModel'
import { PlayerModel } from './PlayerModel'
import { getPlayersWithStack } from '../player-utilities'
import { PlayerCollection } from './PlayerCollection'

export class RoundModel {
  public board: Card[] = []
  public history: HistoryModel[] = []
  public showdown = false
  public currentStreet = 0
  public streets = 0
  public toCall = 0
  public actionHolder: PlayerModel
  public currentPlayer: PlayerModel
  public pots: PotModel[] = []

  constructor(players: PlayerCollection, streets: number) {
    const playersWithStack = getPlayersWithStack(players)
    this.pots.push(new PotModel(playersWithStack))
    this.streets = streets
  }
}
