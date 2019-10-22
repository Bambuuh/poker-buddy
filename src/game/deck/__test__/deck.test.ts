import { DeckHandler } from '../deck-handler'
import { Deck } from '../models/deck'
import { Card } from '../models/card'

describe('Deck', () => {
  let deck: Deck
  const deckHandler = new DeckHandler()

  beforeEach(() => {
    deck = deckHandler.createDeck()
  })

  it('should contain one of each card', () => {
    const hearts = deck.cards.filter(card => card.suite === 'heart')
    const spades = deck.cards.filter(card => card.suite === 'spade')
    const clubs = deck.cards.filter(card => card.suite === 'club')
    const diamonds = deck.cards.filter(card => card.suite === 'diamond')
    expect(deck.cards.length).toBe(52)
    expect(hearts.length).toBe(13)
    expect(spades.length).toBe(13)
    expect(clubs.length).toBe(13)
    expect(diamonds.length).toBe(13)
  })

  it('should be shuffled', () => {
    const firstDeck = deckHandler.createDeck()
    const secondDeck = deckHandler.createDeck()
    const isAlike = firstDeck.cards.every(
      (card, i) =>
        card.suite === secondDeck.cards[i].suite &&
        card.value === secondDeck.cards[i].value
    )
    expect(isAlike).toBeFalsy()
  })

  describe('taking cards', () => {
    it('should return the top card', () => {
      const firstCard = deck.cards[deck.cards.length - 1]
      const firstCompare = deckHandler.takeCard(deck)
      expect(
        firstCompare.suite === firstCard.suite &&
          firstCompare.value === firstCard.value
      ).toBeTruthy()
      const secondCard = deck.cards[deck.cards.length - 1]
      const secondCompare = deckHandler.takeCard(deck)
      expect(
        secondCompare.suite === secondCard.suite &&
          secondCompare.value === secondCard.value
      ).toBeTruthy()
    })

    it('should allow 52 different cards', () => {
      const cards: Card[] = []
      for (let i = 0; i < 52; i++) {
        cards.push(deckHandler.takeCard(deck))
      }

      const isAllDifferent = cards.every((card, index) =>
        cards.some((c, i) =>
          i === index ? true : c.value !== card.value && c.suite !== card.suite
        )
      )

      expect(cards.length).toBe(52)
      expect(isAllDifferent).toBeTruthy()
      expect(deck.cards.length).toBe(0)
    })
  })
})
