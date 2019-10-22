import { Card } from './card'

export class Deck {
  public cards: Card[]
  public usedCards: Card[] = []

  constructor(cards: Card[]) {
    this.cards = cards
  }
}
