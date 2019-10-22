import { Card } from './models/card'
import { Deck } from './models/deck'

export class DeckHandler {
  private cards = this.generateCards()

  public createDeck() {
    const cards = this.getShuffledCards()
    return new Deck(cards)
  }

  private generateCards() {
    const suites: ('spade' | 'heart' | 'club' | 'diamond')[] = [
      'spade',
      'heart',
      'club',
      'diamond'
    ]
    const cards = []
    for (const suite of suites) {
      for (let j = 2; j <= 14; j++) {
        cards.push(new Card(suite, j))
      }
    }
    return cards
  }

  private getShuffledCards() {
    const cards = [...this.cards]
    let currentIndex = cards.length,
      temporaryValue,
      randomIndex

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1
      temporaryValue = cards[currentIndex]
      cards[currentIndex] = cards[randomIndex]
      cards[randomIndex] = temporaryValue
    }

    return cards
  }

  public takeCard(deck: Deck) {
    const card = deck.cards.pop()
    deck.usedCards.push(card)
    return card
  }
}
