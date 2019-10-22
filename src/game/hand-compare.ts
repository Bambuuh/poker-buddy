import { Card } from './deck/models/card'
import { HandScoreModel } from './models/HandScoreModel'

export class HandCompare {
  public getScore(hand: Card[], board: Card[]): HandScoreModel {
    const cards = [...hand, ...board].sort((a, b) => {
      if (a.value > b.value) {
        return -1
      } else if (a.value < b.value) {
        return 1
      } else {
        return 0
      }
    })

    let result

    result = this.isStraightFlush(cards)
    if (result) {
      return {
        score: 8,
        highCard: this.getHighestCard(result),
        highHand: this.getHighestCard(result)
      }
    }

    result = this.isFourOfAKind(cards)
    if (result) {
      return {
        score: 7,
        highCard: this.getHighestCard(cards),
        highHand: this.getHighestCard(result)
      }
    }

    result = this.isFullHouse(cards)
    if (result) {
      return {
        score: 6,
        highCard: this.getHighestCard(result),
        highHand: this.getHighestCard(result)
      }
    }

    result = this.isFlush(cards)
    if (result) {
      return {
        score: 5,
        highCard: this.getHighestCard(result),
        highHand: this.getHighestCard(result)
      }
    }

    result = this.isStraight(cards)
    if (result) {
      return {
        score: 4,
        highCard: this.getHighestCard(result),
        highHand: this.getHighestCard(result)
      }
    }
    result = this.isThreeOfAKind(cards)
    if (result) {
      return {
        score: 3,
        highCard: this.getHighestCard(cards),
        highHand: this.getHighestCard(result)
      }
    }

    result = this.isPair(cards)
    if (result) {
      if (result.length === 4) {
        return {
          score: 2,
          highCard: this.getHighestCard(cards),
          highHand: this.getHighestCard(result)
        }
      } else {
        return {
          score: 1,
          highCard: this.getHighestCard(cards),
          highHand: result[0].value
        }
      }
    }

    const highCard = this.getHighestCard(cards)
    return {
      score: 0,
      highCard: highCard,
      highHand: highCard
    }
  }

  public isStraightFlush(cards: Card[]) {
    let result: Card[]
    const suites = ['heart', 'spade', 'diamond', 'club']
    for (const suite of suites) {
      const filtered = cards.filter(card => card.suite === suite)
      if (filtered.length >= 5) {
        result = this.isStraight(filtered)
        if (result) {
          break
        }
      }
    }

    return result
  }

  public isFourOfAKind(cards: Card[]) {
    let result = undefined
    for (const card of cards) {
      const filtered = cards.filter(c => card.value === c.value)
      if (filtered.length === 4) {
        result = filtered
        break
      }
    }
    return result
  }

  public isFullHouse(cards: Card[]) {
    let copy = cards
    let three: Card[] = undefined
    let two: Card[] = undefined
    let result: Card[] = undefined
    for (const card of cards) {
      const filtered = copy.filter(c => card.value === c.value)
      if (filtered.length === 3) {
        three = filtered
        copy = copy.filter(c => c.value !== three[0].value)
      } else if (filtered.length === 2) {
        two = filtered
        copy = copy.filter(c => c.value !== two[0].value)
      }
    }

    if (two && three) {
      result = [...two, ...three]
    }

    return result
  }

  public isFlush(cards: Card[]) {
    let result: Card[] = undefined
    const suites = ['spade', 'heart', 'diamond', 'club']
    for (const suite of suites) {
      result = cards.filter(card => card.suite === suite)
      if (result.length >= 5) {
        result = result.splice(0, 5)
        break
      } else {
        result = undefined
      }
    }

    return result
  }

  public isStraight(cards: Card[]) {
    const filtered = cards.filter(
      (card, i1) => !cards.some((c, i2) => i2 > i1 && c.value === card.value)
    )
    if (filtered.length < 5) {
      return undefined
    }
    let result: Card[] = undefined
    let indetermined = true
    let index = 0
    while (indetermined) {
      let isStraight = true

      for (let i = 0; i < 4; i++) {
        if (filtered[index + i].value !== filtered[index + i + 1].value + 1) {
          isStraight = false
          index = index + i + 1
          break
        }
      }
      if (
        filtered[index].value === 5 &&
        index <= filtered.length - 4 &&
        filtered[0].value === 14
      ) {
        result = this.isFiveHighStraigh(filtered)
        indetermined = false
      }
      if (isStraight) {
        result = filtered.slice(index, index + 5)
        indetermined = false
      } else if (index > filtered.length - 5) {
        indetermined = false
      }
    }

    return result
  }

  public isFiveHighStraigh(cards: Card[], isFlush = false) {
    let isStraight = true
    const start = cards.length - 4
    for (let i = start; i < start + 3; i++) {
      if (cards[i].value !== cards[i + 1].value + 1) {
        isStraight = false
        break
      }
    }
    if (isStraight) {
      const result = cards.slice(start, start + 4)
      return [cards[0], ...result]
    }
    return undefined
  }

  public isThreeOfAKind(cards: Card[]) {
    const result = cards.filter((card, index) =>
      cards.some((c, i) => i !== index && c.value === card.value)
    )
    return result.length === 3 ? result : undefined
  }

  public isPair(cards: Card[]) {
    const result: Card[] = []
    for (let i = 0; i < cards.length - 1; i++) {
      if (cards[i].value === cards[i + 1].value) {
        result.push(cards[i], cards[i + 1])
      }
      if (result.length === 4) {
        break
      }
    }

    return result.length > 0 ? result : undefined
  }

  public getHighestCard(cards: Card[]) {
    return cards.reduce((high, card) => Math.max(high, card.value), 2)
  }
}
