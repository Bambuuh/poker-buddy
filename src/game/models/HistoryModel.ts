import { Card } from '../deck/models/card'

export class HistoryModel {
  public id?: string
  public action: HistoryAction
  public amount?: number
  public cards: Card[]
}

export type HistoryAction =
  | 'bet'
  | 'raise'
  | 'call'
  | 'fold'
  | 'check'
  | 'flop'
  | 'turn'
  | 'river'
  | 'new hand'
