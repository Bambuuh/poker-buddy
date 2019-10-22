import { Card } from '../deck/models/card'
import { HandCompare } from '../hand-compare'

describe('HandCompare', () => {
  const handCompare = new HandCompare()

  it('should be a pair', () => {
    const hand = [new Card('diamond', 12), new Card('heart', 11)]
    const board = [
      new Card('club', 10),
      new Card('club', 9),
      new Card('diamond', 5),
      new Card('heart', 5),
      new Card('diamond', 4)
    ]

    const result = handCompare.getScore(hand, board)
    expect(result.score).toBe(1)
    expect(result.highCard).toBe(12)
    expect(result.highHand).toBe(5)
  })

  it('can determine an empty hand', () => {
    const hand = [new Card('heart', 13), new Card('spade', 7)]
    const board = [
      new Card('heart', 4),
      new Card('spade', 6),
      new Card('club', 8),
      new Card('club', 11),
      new Card('club', 9)
    ]
    const result = handCompare.getScore(hand, board)
    expect(result.score).toBe(0)
    expect(result.highCard).toBe(13)
    expect(result.highHand).toBe(13)
  })

  it('can find a pair', () => {
    const hand = [new Card('heart', 13), new Card('spade', 7)]
    const board = [
      new Card('heart', 4),
      new Card('spade', 6),
      new Card('club', 8),
      new Card('club', 11),
      new Card('club', 7)
    ]
    const result = handCompare.getScore(hand, board)
    expect(result.score).toBe(1)
    expect(result.highCard).toBe(13)
    expect(result.highHand).toBe(7)
  })

  it('can find two pair', () => {
    const hand = [new Card('heart', 7), new Card('spade', 7)]
    const board = [
      new Card('heart', 4),
      new Card('spade', 4),
      new Card('club', 8),
      new Card('club', 11),
      new Card('club', 13)
    ]
    const result = handCompare.getScore(hand, board)
    expect(result.score).toBe(2)
    expect(result.highCard).toBe(13)
    expect(result.highHand).toBe(7)
  })

  it('can find two pair with three available pairs', () => {
    const hand = [new Card('diamond', 6), new Card('spade', 10)]
    const board = [
      new Card('club', 3),
      new Card('diamond', 3),
      new Card('diamond', 8),
      new Card('heart', 10),
      new Card('heart', 6)
    ]
    const result = handCompare.getScore(hand, board)
    expect(result.score).toBe(2)
    expect(result.highCard).toBe(10)
    expect(result.highHand).toBe(10)
  })

  it('can find three of a kind', () => {
    const hand = [new Card('heart', 7), new Card('spade', 7)]
    const board = [
      new Card('heart', 4),
      new Card('spade', 6),
      new Card('club', 7),
      new Card('club', 11),
      new Card('club', 13)
    ]
    const result = handCompare.getScore(hand, board)
    expect(result.score).toBe(3)
    expect(result.highCard).toBe(13)
    expect(result.highHand).toBe(7)
  })

  it('can find a straight end', () => {
    const hand = [new Card('heart', 3), new Card('spade', 5)]
    const board = [
      new Card('heart', 4),
      new Card('spade', 6),
      new Card('club', 7),
      new Card('club', 11),
      new Card('club', 13)
    ]
    const result = handCompare.getScore(hand, board)
    expect(result.score).toBe(4)
    expect(result.highCard).toBe(7)
    expect(result.highHand).toBe(7)
  })

  it('can find straight with three of a kind', () => {
    const hand = [new Card('heart', 6), new Card('spade', 6)]
    const board = [
      new Card('diamond', 6),
      new Card('spade', 5),
      new Card('heart', 4),
      new Card('heart', 3),
      new Card('spade', 2)
    ]
    const result = handCompare.getScore(hand, board)
    expect(result.score).toBe(4)
    expect(result.highCard).toBe(6)
    expect(result.highHand).toBe(6)
  })

  it('can find a straight start', () => {
    const hand = [new Card('heart', 3), new Card('spade', 5)]
    const board = [
      new Card('heart', 9),
      new Card('spade', 10),
      new Card('club', 12),
      new Card('club', 11),
      new Card('club', 13)
    ]
    const result = handCompare.getScore(hand, board)
    expect(result.score).toBe(4)
    expect(result.highCard).toBe(13)
    expect(result.highHand).toBe(13)
  })

  it('can find a straight middle', () => {
    const hand = [new Card('heart', 3), new Card('spade', 7)]
    const board = [
      new Card('heart', 9),
      new Card('spade', 10),
      new Card('club', 8),
      new Card('club', 11),
      new Card('club', 13)
    ]
    const result = handCompare.getScore(hand, board)
    expect(result.score).toBe(4)
    expect(result.highCard).toBe(11)
    expect(result.highHand).toBe(11)
  })

  it('can find a straight ace high', () => {
    const hand = [new Card('heart', 3), new Card('spade', 7)]
    const board = [
      new Card('heart', 14),
      new Card('spade', 10),
      new Card('club', 12),
      new Card('club', 11),
      new Card('club', 13)
    ]
    const result = handCompare.getScore(hand, board)
    expect(result.score).toBe(4)
    expect(result.highCard).toBe(14)
    expect(result.highHand).toBe(14)
  })

  it('can find a straight ace low', () => {
    const hand = [new Card('heart', 3), new Card('spade', 2)]
    const board = [
      new Card('heart', 14),
      new Card('spade', 4),
      new Card('club', 5),
      new Card('club', 11),
      new Card('club', 13)
    ]
    const result = handCompare.getScore(hand, board)
    expect(result.score).toBe(4)
    expect(result.highCard).toBe(14)
    expect(result.highHand).toBe(14)
  })

  it('can find a flush', () => {
    const hand = [new Card('heart', 3), new Card('spade', 5)]
    const board = [
      new Card('spade', 4),
      new Card('spade', 6),
      new Card('spade', 7),
      new Card('spade', 11),
      new Card('club', 13)
    ]
    const result = handCompare.getScore(hand, board)
    expect(result.score).toBe(5)
    expect(result.highCard).toBe(11)
    expect(result.highHand).toBe(11)
  })

  it('can find a full house', () => {
    const hand = [new Card('heart', 3), new Card('spade', 5)]
    const board = [
      new Card('diamond', 5),
      new Card('club', 5),
      new Card('spade', 3),
      new Card('spade', 11),
      new Card('club', 13)
    ]
    const result = handCompare.getScore(hand, board)
    expect(result.score).toBe(6)
    expect(result.highCard).toBe(5)
    expect(result.highHand).toBe(5)
  })

  it('can find four of a kind', () => {
    const hand = [new Card('heart', 5), new Card('spade', 5)]
    const board = [
      new Card('diamond', 5),
      new Card('club', 5),
      new Card('spade', 3),
      new Card('spade', 11),
      new Card('club', 13)
    ]
    const result = handCompare.getScore(hand, board)
    expect(result.score).toBe(7)
    expect(result.highCard).toBe(13)
    expect(result.highHand).toBe(5)
  })

  it('can find straight flush first index', () => {
    const hand = [new Card('heart', 5), new Card('spade', 7)]
    const board = [
      new Card('diamond', 5),
      new Card('spade', 8),
      new Card('spade', 9),
      new Card('spade', 11),
      new Card('spade', 10)
    ]
    const result = handCompare.getScore(hand, board)
    expect(result.score).toBe(8)
    expect(result.highCard).toBe(11)
    expect(result.highHand).toBe(11)
  })

  it('can find straight flush last index', () => {
    const hand = [new Card('heart', 13), new Card('spade', 7)]
    const board = [
      new Card('diamond', 12),
      new Card('spade', 8),
      new Card('spade', 9),
      new Card('spade', 11),
      new Card('spade', 10)
    ]
    const result = handCompare.getScore(hand, board)
    expect(result.score).toBe(8)
    expect(result.highCard).toBe(11)
    expect(result.highHand).toBe(11)
  })

  it('can find straight flush with three of a kind', () => {
    const hand = [new Card('heart', 6), new Card('spade', 6)]
    const board = [
      new Card('diamond', 6),
      new Card('spade', 5),
      new Card('spade', 4),
      new Card('spade', 3),
      new Card('spade', 2)
    ]
    const result = handCompare.getScore(hand, board)
    expect(result.score).toBe(8)
    expect(result.highCard).toBe(6)
    expect(result.highHand).toBe(6)
  })

  it('can find straight flush with ace high', () => {
    const hand = [new Card('heart', 6), new Card('spade', 14)]
    const board = [
      new Card('diamond', 6),
      new Card('spade', 10),
      new Card('spade', 11),
      new Card('spade', 12),
      new Card('spade', 13)
    ]
    const result = handCompare.getScore(hand, board)
    expect(result.score).toBe(8)
    expect(result.highCard).toBe(14)
    expect(result.highHand).toBe(14)
  })

  it('can find straight flush with ace low', () => {
    const hand = [new Card('heart', 6), new Card('spade', 14)]
    const board = [
      new Card('diamond', 6),
      new Card('spade', 2),
      new Card('spade', 3),
      new Card('spade', 4),
      new Card('spade', 5)
    ]
    const result = handCompare.getScore(hand, board)
    expect(result.score).toBe(8)
    expect(result.highCard).toBe(14)
    expect(result.highHand).toBe(14)
  })

  describe('sigh', () => {
    describe('three of a kinds', () => {
      it('threes', () => {
        const hand = [new Card('heart', 14), new Card('spade', 5)]
        const board = [
          new Card('club', 2),
          new Card('club', 4),
          new Card('heart', 3),
          new Card('club', 3),
          new Card('spade', 3)
        ]
        const result = handCompare.getScore(hand, board)
        expect(result.score).toBe(4)
      })
      it('fours', () => {
        const hand = [new Card('heart', 14), new Card('spade', 5)]
        const board = [
          new Card('club', 3),
          new Card('club', 2),
          new Card('heart', 4),
          new Card('club', 4),
          new Card('spade', 4)
        ]
        const result = handCompare.getScore(hand, board)
        expect(result.score).toBe(4)
      })
      it('fives', () => {
        const hand = [new Card('heart', 14), new Card('spade', 5)]
        const board = [
          new Card('club', 3),
          new Card('club', 4),
          new Card('heart', 2),
          new Card('club', 5),
          new Card('spade', 5)
        ]
        const result = handCompare.getScore(hand, board)
        expect(result.score).toBe(4)
      })
      it('aces', () => {
        const hand = [new Card('heart', 14), new Card('spade', 5)]
        const board = [
          new Card('club', 3),
          new Card('club', 4),
          new Card('heart', 2),
          new Card('club', 14),
          new Card('spade', 14)
        ]
        const result = handCompare.getScore(hand, board)
        expect(result.score).toBe(4)
      })
      it('twos', () => {
        const hand = [new Card('heart', 14), new Card('spade', 5)]
        const board = [
          new Card('club', 3),
          new Card('club', 4),
          new Card('heart', 2),
          new Card('club', 2),
          new Card('spade', 2)
        ]
        const result = handCompare.getScore(hand, board)
        expect(result.score).toBe(4)
      })
    })
    describe('pairs', () => {
      it('threes', () => {
        const hand = [new Card('heart', 14), new Card('spade', 5)]
        const board = [
          new Card('club', 2),
          new Card('club', 4),
          new Card('heart', 8),
          new Card('club', 3),
          new Card('spade', 3)
        ]
        const result = handCompare.getScore(hand, board)
        expect(result.score).toBe(4)
      })
      it('fours', () => {
        const hand = [new Card('heart', 14), new Card('spade', 5)]
        const board = [
          new Card('club', 3),
          new Card('club', 2),
          new Card('heart', 8),
          new Card('club', 4),
          new Card('spade', 4)
        ]
        const result = handCompare.getScore(hand, board)
        expect(result.score).toBe(4)
      })
      it('fives', () => {
        const hand = [new Card('heart', 14), new Card('spade', 5)]
        const board = [
          new Card('club', 3),
          new Card('club', 4),
          new Card('heart', 2),
          new Card('club', 8),
          new Card('spade', 5)
        ]
        const result = handCompare.getScore(hand, board)
        expect(result.score).toBe(4)
      })
      it('aces', () => {
        const hand = [new Card('heart', 14), new Card('spade', 5)]
        const board = [
          new Card('club', 3),
          new Card('club', 4),
          new Card('heart', 2),
          new Card('club', 8),
          new Card('spade', 14)
        ]
        const result = handCompare.getScore(hand, board)
        expect(result.score).toBe(4)
      })
      it('twos', () => {
        const hand = [new Card('heart', 14), new Card('spade', 5)]
        const board = [
          new Card('club', 3),
          new Card('club', 4),
          new Card('heart', 8),
          new Card('club', 2),
          new Card('spade', 2)
        ]
        const result = handCompare.getScore(hand, board)
        expect(result.score).toBe(4)
      })
    })
  })
})
