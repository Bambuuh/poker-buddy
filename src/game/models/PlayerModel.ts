import { Card } from '../deck/models/card'
import { HandScoreModel } from './HandScoreModel'

export type PlayerInitModel = {
  username: string
  playerId: string
  avatarIndex?: number
  stack?: number
}

export class PlayerModel {
  public avatarIndex: number
  public username: string
  public playerId: string
  public stack = 0
  public stake = 0
  public isAllIn = false
  public isFolded = false
  public isOffline = false

  public handScore?: HandScoreModel
  public cards?: Card[]

  constructor({
    avatarIndex = 0,
    username,
    playerId,
    stack = 0
  }: PlayerInitModel) {
    this.avatarIndex = avatarIndex
    this.username = username
    this.playerId = playerId
    this.stack = stack
  }
}
