import { GameModel } from '../models/GameModel'
import { Card } from '../deck/models/card'
import { PlayerModel } from '../models/PlayerModel'
import { getActivePlayers } from '../player-utilities'
import { PokerEngine } from '../poker-engine'
import * as potUtils from '../pot-utilities'

describe('PokerEngine', () => {
  let game: GameModel
  let engine: PokerEngine
  beforeEach(() => {
    game = new GameModel('123', {
      '1': new PlayerModel({ username: '1', playerId: '1', stack: 1000 }),
      '2': new PlayerModel({ username: '2', playerId: '2', stack: 1000 }),
      '3': new PlayerModel({ username: '3', playerId: '3', stack: 1000 })
    })
    game.blinds = { small: 10, big: 20 }
    game.gameStarted = true
    game.button = game.players['3']
    engine = new PokerEngine()
  })

  describe('setup round', () => {
    it('clears all cards', () => {
      engine.start(game)
      engine.action(game, { playerId: '1', type: 'bet', amount: 100 })
      engine.action(game, { playerId: '2', type: 'fold' })
      engine.action(game, { playerId: '3', type: 'fold' })
      engine.setupRound(game)
      const allCardsAreEmpty = Object.keys(game.players).every(
        id => game.players[id].cards.length === 0
      )
      expect(allCardsAreEmpty).toBeTruthy()
    })
  })

  describe('general game', () => {
    it('all checking', () => {
      const playSpy = spyOn(engine.texasHoldem, 'play').and.callThrough()
      engine.start(game)
      engine.action(game, { playerId: '1', type: 'check' })
      engine.action(game, { playerId: '2', type: 'check' })
      expect(playSpy).toHaveBeenCalledTimes(1)
      engine.action(game, { playerId: '3', type: 'check' })
      expect(playSpy).toHaveBeenCalledTimes(2)
      engine.action(game, { playerId: '2', type: 'check' })
      engine.action(game, { playerId: '3', type: 'check' })
      expect(playSpy).toHaveBeenCalledTimes(2)
      engine.action(game, { playerId: '1', type: 'check' })
      expect(playSpy).toHaveBeenCalledTimes(3)
      engine.action(game, { playerId: '2', type: 'check' })
      engine.action(game, { playerId: '3', type: 'check' })
      expect(playSpy).toHaveBeenCalledTimes(3)
      engine.action(game, { playerId: '1', type: 'check' })
      expect(playSpy).toHaveBeenCalledTimes(4)
      engine.action(game, { playerId: '2', type: 'check' })
      engine.action(game, { playerId: '3', type: 'check' })
      expect(playSpy).toHaveBeenCalledTimes(4)
      engine.action(game, { playerId: '1', type: 'check' })
      expect(playSpy).toHaveBeenCalledTimes(4)
      expect(game.round.board.length).toBe(5)
      expect(game.round.showdown).toBeTruthy()
    })

    it('doesnt deal in players without stacks', () => {
      game.players = {
        '1': new PlayerModel({ username: '1', playerId: '1', stack: 0 }),
        '2': new PlayerModel({ username: '2', playerId: '2', stack: 200 }),
        '3': new PlayerModel({ username: '3', playerId: '3', stack: 1000 }),
        '4': new PlayerModel({ username: '4', playerId: '4', stack: 1000 })
      }
      game.button = game.players['4']
      engine.start(game)
      const playersWithCards = Object.keys(game.players).filter(
        id => game.players[id].cards.length > 0
      )
      expect(game.players['1'].cards.length).toBe(0)
      expect(playersWithCards.length).toBe(3)
    })

    it('with betting', () => {
      engine.setupRound(game)
      const playSpy = spyOn(engine.texasHoldem, 'play').and.callThrough()
      engine.start(game)
      engine.action(game, { playerId: '1', type: 'bet', amount: 100 })
      engine.action(game, { playerId: '2', type: 'call' })
      engine.action(game, { playerId: '3', type: 'call' })
      expect(playSpy).toHaveBeenCalledTimes(2)
      engine.action(game, { playerId: '1', type: 'bet', amount: 100 })
      engine.action(game, { playerId: '2', type: 'call' })
      engine.action(game, { playerId: '3', type: 'call' })
      expect(playSpy).toHaveBeenCalledTimes(3)
      engine.action(game, { playerId: '1', type: 'bet', amount: 100 })
      engine.action(game, { playerId: '2', type: 'call' })
      engine.action(game, { playerId: '3', type: 'call' })
      expect(playSpy).toHaveBeenCalledTimes(4)
      engine.action(game, { playerId: '1', type: 'bet', amount: 100 })
      engine.action(game, { playerId: '2', type: 'call' })
      engine.action(game, { playerId: '3', type: 'call' })
      expect(game.round.board.length).toBe(5)
      expect(game.round.showdown).toBeTruthy()
    })

    it('shuld handle folding without bets', () => {
      const dividePotSpy = spyOn(potUtils, 'dividePot').and.callThrough()
      engine.start(game)
      engine.action(game, { playerId: '1', type: 'call' })
      engine.action(game, { playerId: '2', type: 'call' })
      engine.action(game, { playerId: '3', type: 'check' })

      engine.action(game, { playerId: '2', type: 'fold' })
      engine.action(game, { playerId: '3', type: 'fold' })

      expect(dividePotSpy).toHaveBeenCalled()
      expect(game.round.showdown).toBeTruthy()
    })

    it('betting with one folding', () => {
      const playSpy = spyOn(engine.texasHoldem, 'play').and.callThrough()
      engine.start(game)
      engine.action(game, { playerId: '1', type: 'bet', amount: 100 })
      engine.action(game, { playerId: '2', type: 'call' })
      engine.action(game, { playerId: '3', type: 'fold' })
      expect(playSpy).toHaveBeenCalledTimes(2)
      engine.action(game, { playerId: '2', type: 'bet', amount: 100 })
      engine.action(game, { playerId: '1', type: 'call' })
      expect(playSpy).toHaveBeenCalledTimes(3)
      engine.action(game, { playerId: '2', type: 'bet', amount: 100 })
      engine.action(game, { playerId: '1', type: 'call' })
      expect(playSpy).toHaveBeenCalledTimes(4)
      engine.action(game, { playerId: '2', type: 'bet', amount: 100 })
      engine.action(game, { playerId: '1', type: 'call' })
      expect(game.round.board.length).toBe(5)
      expect(game.round.showdown).toBeTruthy()
    })

    it('betting with all folding', () => {
      const playSpy = spyOn(engine.texasHoldem, 'play').and.callThrough()
      engine.start(game)
      engine.action(game, { playerId: '1', type: 'bet', amount: 100 })
      engine.action(game, { playerId: '2', type: 'call' })
      engine.action(game, { playerId: '3', type: 'fold' })
      expect(playSpy).toHaveBeenCalledTimes(2)
      engine.action(game, { playerId: '2', type: 'bet', amount: 100 })
      engine.action(game, { playerId: '1', type: 'fold' })
      expect(playSpy).toHaveBeenCalledTimes(2)
      expect(game.round.board.length).toBe(3)
      expect(game.round.showdown).toBeTruthy()
    })
  })

  describe('betting', () => {
    it('gives the better actionHolder', () => {
      engine.start(game)
      engine.action(game, { playerId: '1', type: 'check' })
      engine.action(game, { playerId: '2', type: 'check' })
      engine.action(game, { playerId: '3', type: 'check' })
      engine.action(game, { playerId: '2', type: 'bet', amount: 200 })
      const { round } = game
      expect(round.actionHolder.playerId).toBe('2')
    })

    it('adds to stake when betting game', () => {
      engine.start(game)
      engine.action(game, { playerId: '1', type: 'bet', amount: 100 })
      const { round } = game
      expect(getActivePlayers(game.players)['1'].stake).toBe(100)
      expect(round.pots[0].amount).toBe(0)
    })

    it('builds pot during game', () => {
      engine.start(game)
      engine.action(game, { playerId: '1', type: 'bet', amount: 100 })
      engine.action(game, { playerId: '2', type: 'call' })
      engine.action(game, { playerId: '3', type: 'fold' })
      const { players, round } = game
      expect(players['1'].stack).toBe(900)
      expect(players['2'].stack).toBe(900)
      expect(players['3'].stack).toBe(980)
      expect(getActivePlayers(game.players)['1'].stake).toBe(0)
      expect(getActivePlayers(game.players)['2'].stake).toBe(0)
      expect(round.pots[0].amount).toBe(220)
    })

    it('assigns pot after game', () => {
      engine.start(game)
      engine.action(game, { playerId: '1', type: 'bet', amount: 100 })
      engine.action(game, { playerId: '2', type: 'call' })
      engine.action(game, { playerId: '3', type: 'fold' })
      engine.action(game, { playerId: '2', type: 'bet', amount: 100 })
      engine.action(game, { playerId: '1', type: 'call' })
      engine.action(game, { playerId: '2', type: 'check' })
      engine.action(game, { playerId: '1', type: 'check' })
      game.round.board = [
        new Card('heart', 7),
        new Card('heart', 10),
        new Card('heart', 5),
        new Card('heart', 4),
        new Card('spade', 2)
      ]
      game.players['1'].cards = [new Card('heart', 14), new Card('club', 2)]
      game.players['2'].cards = [new Card('diamond', 14), new Card('club', 2)]
      engine.action(game, { playerId: '2', type: 'check' })
      engine.action(game, { playerId: '1', type: 'check' })
      const { players } = game
      expect(players['1'].stack).toBe(1220)
      expect(players['2'].stack).toBe(800)
      expect(players['3'].stack).toBe(980)
    })
  })

  describe('raising', () => {
    it('gives the raiser actionHolder', () => {
      engine.start(game)
      engine.action(game, { playerId: '1', type: 'bet', amount: 100 })
      engine.action(game, { playerId: '2', type: 'raise', amount: 200 })
      const { round } = game
      expect(round.actionHolder.playerId).toBe('2')
    })

    it('builds stake', () => {
      engine.start(game)
      engine.action(game, { playerId: '1', type: 'bet', amount: 100 })
      engine.action(game, { playerId: '2', type: 'raise', amount: 200 })
      engine.action(game, { playerId: '3', type: 'fold' })
      engine.action(game, { playerId: '1', type: 'raise', amount: 400 })
      const { round } = game
      expect(game.players['1'].stake).toBe(400)
      expect(game.players['2'].stake).toBe(200)
      expect(round.pots[0].amount).toBe(0)
    })

    it('builds pot during game', () => {
      engine.start(game)
      engine.action(game, { playerId: '1', type: 'bet', amount: 100 })
      engine.action(game, { playerId: '2', type: 'raise', amount: 200 })
      engine.action(game, { playerId: '3', type: 'fold' })
      engine.action(game, { playerId: '1', type: 'call' })
      const { players, round } = game
      expect(players['1'].stack).toBe(800)
      expect(players['2'].stack).toBe(800)
      expect(players['3'].stack).toBe(980)
      expect(getActivePlayers(game.players)['1'].stake).toBe(0)
      expect(getActivePlayers(game.players)['2'].stake).toBe(0)
      expect(round.pots[0].amount).toBe(420)
    })

    it('builds pot when raised and folds', () => {
      engine.start(game)
      engine.action(game, { playerId: '1', type: 'bet', amount: 100 })
      engine.action(game, { playerId: '2', type: 'raise', amount: 200 })
      engine.action(game, { playerId: '3', type: 'call' })
      engine.action(game, { playerId: '1', type: 'fold' })
      const { players, round } = game
      expect(players['1'].stack).toBe(900)
      expect(players['2'].stack).toBe(800)
      expect(players['3'].stack).toBe(800)
      expect(game.players['1'].stake).toBe(0)
      expect(game.players['2'].stake).toBe(0)
      expect(round.pots[0].amount).toBe(500)
    })
  })

  describe('folding', () => {
    it('can handle folding first street', () => {
      engine.start(game)
      engine.action(game, { playerId: '1', type: 'call' })
      engine.action(game, { playerId: '2', type: 'fold' })
      engine.action(game, { playerId: '3', type: 'check' })
      expect(game.round.currentPlayer.playerId).toBe('3')
    })

    it('should remove the cards from the folded player', () => {
      engine.start(game)
      engine.action(game, { playerId: '1', type: 'call' })
      engine.action(game, { playerId: '2', type: 'fold' })
      expect(game.players['2'].cards.length).toBe(0)
    })

    it('should not calculate hands if all fold', () => {
      const handScoreSpy = spyOn(
        engine.handCompare,
        'getScore'
      ).and.callThrough()
      game.button = game.players['1']
      engine.start(game)
      engine.action(game, { playerId: '2', type: 'bet', amount: 100 })
      engine.action(game, { playerId: '3', type: 'raise', amount: 200 })
      engine.action(game, { playerId: '1', type: 'fold' })
      engine.action(game, { playerId: '2', type: 'fold' })
      expect(game.round.showdown).toBeTruthy()
      expect(handScoreSpy).not.toHaveBeenCalled()
    })
  })

  describe('leaving game', () => {
    describe('with 3 or more players', () => {
      it('should check if possible and  active player', () => {
        const actionSpy = spyOn(engine, 'action').and.callThrough()
        engine.start(game)
        engine.action(game, { playerId: '1', type: 'check' })
        engine.action(game, { playerId: '2', type: 'check' })
        engine.leaveGame(game, '3')
        expect(actionSpy).toHaveBeenCalledWith(game, {
          playerId: '3',
          type: 'check'
        })
      })

      it('should check if possible on its turn', () => {
        const actionSpy = spyOn(engine, 'action').and.callThrough()
        engine.start(game)
        engine.action(game, { playerId: '1', type: 'check' })
        engine.leaveGame(game, '3')
        engine.action(game, { playerId: '2', type: 'check' })
        expect(actionSpy).toHaveBeenCalledWith(game, {
          playerId: '3',
          type: 'check'
        })
      })

      it('should fold if necesary', () => {
        const actionSpy = spyOn(engine, 'action').and.callThrough()
        engine.start(game)
        engine.action(game, { playerId: '1', type: 'check' })
        engine.action(game, { playerId: '2', type: 'check' })
        engine.action(game, { playerId: '3', type: 'bet', amount: 100 })
        engine.action(game, { playerId: '1', type: 'raise', amount: 200 })
        engine.leaveGame(game, '3')
        engine.action(game, { playerId: '2', type: 'call' })
        expect(actionSpy).toHaveBeenCalledWith(game, {
          playerId: '3',
          type: 'fold'
        })
      })

      it('should pass action to the next player if not last in turn', () => {
        engine.start(game)
        engine.action(game, { playerId: '1', type: 'bet', amount: 100 })
        engine.leaveGame(game, '2')
        expect(game.round.currentPlayer.playerId).toBe('3')
      })

      it('should be able to keep going after leaver folds', () => {
        engine.start(game)
        engine.action(game, { playerId: '1', type: 'bet', amount: 100 })
        engine.leaveGame(game, '2')
        engine.action(game, { playerId: '3', type: 'call' })
        expect(game.round.board.length).toBe(3)
        engine.action(game, { playerId: '3', type: 'check' })
        engine.action(game, { playerId: '1', type: 'check' })
        expect(game.round.board.length).toBe(4)
        engine.action(game, { playerId: '3', type: 'bet', amount: 100 })
        engine.action(game, { playerId: '1', type: 'call' })
        expect(game.round.board.length).toBe(5)
        engine.action(game, { playerId: '3', type: 'check' })
        engine.action(game, { playerId: '1', type: 'check' })
        expect(game.round.showdown).toBeTruthy()
      })

      it('should be able to keep going after leaver checks', () => {
        engine.start(game)
        engine.action(game, { playerId: '1', type: 'bet', amount: 100 })
        engine.action(game, { playerId: '2', type: 'raise', amount: 200 })
        engine.action(game, { playerId: '3', type: 'call' })
        engine.leaveGame(game, '2')
        engine.action(game, { playerId: '1', type: 'call' })
        expect(game.round.board.length).toBe(3)
        engine.action(game, { playerId: '3', type: 'check' })
        engine.action(game, { playerId: '1', type: 'check' })
        expect(game.round.board.length).toBe(4)
        engine.action(game, { playerId: '3', type: 'check' })
        engine.action(game, { playerId: '1', type: 'check' })
        expect(game.round.board.length).toBe(5)
        engine.action(game, { playerId: '3', type: 'check' })
        engine.action(game, { playerId: '1', type: 'check' })
        expect(game.round.showdown).toBeTruthy()
      })

      it('should do next street if last to act', () => {
        engine.start(game)
        engine.action(game, { playerId: '1', type: 'bet', amount: 100 })
        engine.action(game, { playerId: '2', type: 'call' })
        engine.leaveGame(game, '3')
        expect(game.round.board.length).toBe(3)
        engine.action(game, { playerId: '2', type: 'check' })
        engine.action(game, { playerId: '1', type: 'check' })
        expect(game.round.board.length).toBe(4)
        engine.action(game, { playerId: '2', type: 'bet', amount: 100 })
        engine.action(game, { playerId: '1', type: 'call' })
        expect(game.round.board.length).toBe(5)
        engine.action(game, { playerId: '2', type: 'check' })
        engine.action(game, { playerId: '1', type: 'check' })
        expect(game.round.showdown).toBeTruthy()
      })
    })
  })

  describe('Blinds', () => {
    it('sets correct blinds with empty stacks', () => {
      game.players = {
        '1': new PlayerModel({ username: '1', playerId: '1', stack: 1000 }),
        '2': new PlayerModel({ username: '2', playerId: '2', stack: 0 }),
        '3': new PlayerModel({ username: '3', playerId: '3', stack: 1000 }),
        '4': new PlayerModel({ username: '4', playerId: '4', stack: 1000 })
      }
      game.blinds = { small: 10, big: 20 }
      game.button = game.players['4']
      engine.setupRound(game)
      expect(game.bigBlind.playerId).toBe('4')
      expect(game.players['3'].stake).toBe(10)
      expect(game.players['4'].stake).toBe(20)
    })

    it('sets correct stake and stack', () => {
      game.players = {
        '1': new PlayerModel({ username: '1', playerId: '1', stack: 1000 }),
        '2': new PlayerModel({ username: '2', playerId: '2', stack: 1000 }),
        '3': new PlayerModel({ username: '3', playerId: '3', stack: 1000 }),
        '4': new PlayerModel({ username: '4', playerId: '4', stack: 1000 })
      }
      game.blinds = { small: 10, big: 20 }
      game.button = game.players['1']
      engine.setupRound(game)
      expect(game.players['3'].stake).toBe(10)
      expect(game.players['4'].stake).toBe(20)
      expect(game.players['1'].stack).toBe(1000)
      expect(game.players['2'].stack).toBe(1000)
      expect(game.players['3'].stack).toBe(990)
      expect(game.players['4'].stack).toBe(980)
    })

    it('works with one folding', () => {
      const newGame = new GameModel('123', {
        '1': new PlayerModel({ username: '1', playerId: '1', stack: 1000 }),
        '2': new PlayerModel({ username: '2', playerId: '2', stack: 1000 })
      })
      newGame.blinds = { small: 10, big: 20 }
      newGame.button = newGame.players['1']
      engine.start(newGame)
      engine.action(newGame, { playerId: '2', type: 'fold' })
      expect(newGame.round.showdown).toBeTruthy()
      expect(newGame.players['1'].stack).toBe(1010)
      expect(newGame.players['2'].stack).toBe(990)
    })

    it('handles 2 players', () => {
      game.players = {
        '1': new PlayerModel({ username: '1', playerId: '1', stack: 1000 }),
        '2': new PlayerModel({ username: '2', playerId: '2', stack: 1000 })
      }
      game.blinds = { small: 10, big: 20 }
      game.button = game.players['1']
      engine.setupRound(game)
      expect(game.round.actionHolder.playerId).toBe('2')
      expect(game.players['1'].stake).toBe(20)
      expect(game.players['2'].stake).toBe(10)
    })

    it('handles 3 players', () => {
      game.players = {
        '1': new PlayerModel({ username: '1', playerId: '1', stack: 1000 }),
        '2': new PlayerModel({ username: '2', playerId: '2', stack: 1000 }),
        '3': new PlayerModel({ username: '3', playerId: '3', stack: 1000 })
      }
      game.blinds = { small: 10, big: 20 }
      game.button = game.players['1']
      engine.setupRound(game)
      expect(game.round.actionHolder.playerId).toBe('2')
      expect(game.players['1'].stake).toBe(20)
      expect(game.players['2'].stake).toBe(0)
      expect(game.players['3'].stake).toBe(10)
    })

    it('handles 4+ players', () => {
      game.players = {
        '1': new PlayerModel({ username: '1', playerId: '1', stack: 1000 }),
        '2': new PlayerModel({ username: '2', playerId: '2', stack: 1000 }),
        '3': new PlayerModel({ username: '3', playerId: '3', stack: 1000 }),
        '4': new PlayerModel({ username: '4', playerId: '4', stack: 1000 })
      }
      game.blinds = { small: 10, big: 20 }
      game.button = game.players['1']
      engine.setupRound(game)
      expect(game.round.actionHolder.playerId).toBe('1')
      expect(game.players['1'].stake).toBe(0)
      expect(game.players['2'].stake).toBe(0)
      expect(game.players['3'].stake).toBe(10)
      expect(game.players['4'].stake).toBe(20)
    })

    it('waits for big blind to act before flopping', () => {
      game.players = {
        '1': new PlayerModel({ username: '1', playerId: '1', stack: 1000 }),
        '2': new PlayerModel({ username: '2', playerId: '2', stack: 1000 }),
        '3': new PlayerModel({ username: '3', playerId: '3', stack: 1000 }),
        '4': new PlayerModel({ username: '4', playerId: '4', stack: 1000 })
      }
      game.blinds = { small: 10, big: 20 }
      engine.start(game)
      engine.action(game, { playerId: '4', type: 'call' })
      engine.action(game, { playerId: '1', type: 'call' })
      engine.action(game, { playerId: '2', type: 'call' })
      expect(game.round.board.length).toBe(0)
      engine.action(game, { playerId: '3', type: 'check' })
      expect(game.round.board.length).toBe(3)
    })
  })

  describe('all in', () => {
    it('builds side pots when player raises all in', () => {
      game.players = {
        '1': new PlayerModel({ username: '1', playerId: '1', stack: 1000 }),
        '2': new PlayerModel({ username: '2', playerId: '2', stack: 200 }),
        '3': new PlayerModel({ username: '3', playerId: '3', stack: 1000 }),
        '4': new PlayerModel({ username: '4', playerId: '4', stack: 1000 })
      }
      game.blinds = { small: 10, big: 20 }
      game.button = game.players['4']
      engine.start(game)
      engine.action(game, { playerId: '4', type: 'call' })
      engine.action(game, { playerId: '1', type: 'call' })
      engine.action(game, { playerId: '2', type: 'raise', amount: 200 })
      engine.action(game, { playerId: '3', type: 'raise', amount: 800 })
      engine.action(game, { playerId: '4', type: 'call' })
      engine.action(game, { playerId: '1', type: 'call' })
      expect(game.round.pots.length).toBe(2)
      expect(game.round.pots[0].amount).toBe(800)
      expect(game.round.pots[1].amount).toBe(1800)
      expect(Object.keys(game.round.pots[0].players).length).toBe(4)
      expect(Object.keys(game.round.pots[1].players).length).toBe(3)
      expect(game.round.pots[1].players['2']).toBeUndefined()
    })

    it('builds side pots when player calls to all in', () => {
      game.players = {
        '1': new PlayerModel({ username: '1', playerId: '1', stack: 1000 }),
        '2': new PlayerModel({ username: '2', playerId: '2', stack: 200 }),
        '3': new PlayerModel({ username: '3', playerId: '3', stack: 1000 }),
        '4': new PlayerModel({ username: '4', playerId: '4', stack: 1000 })
      }
      game.blinds = { small: 10, big: 20 }
      game.button = game.players['4']
      engine.start(game)
      engine.action(game, { playerId: '4', type: 'call' })
      engine.action(game, { playerId: '1', type: 'raise', amount: 800 })
      engine.action(game, { playerId: '2', type: 'call' })
      engine.action(game, { playerId: '3', type: 'call' })
      engine.action(game, { playerId: '4', type: 'call' })
      engine.action(game, { playerId: '1', type: 'call' })
      expect(game.round.pots.length).toBe(2)
      expect(game.round.pots[0].amount).toBe(800)
      expect(game.round.pots[1].amount).toBe(1800)
      expect(Object.keys(game.round.pots[0].players).length).toBe(4)
      expect(Object.keys(game.round.pots[1].players).length).toBe(3)
      expect(game.round.pots[1].players['2']).toBeUndefined()
    })
  })

  it('should finish the hand if only one player has stack', () => {
    game.players = {
      '1': new PlayerModel({ username: '1', playerId: '1', stack: 100 }),
      '2': new PlayerModel({ username: '2', playerId: '2', stack: 140 }),
      '3': new PlayerModel({ username: '3', playerId: '3', stack: 500 })
    }
    game.blinds = { small: 10, big: 20 }
    game.button = game.players['1']
    engine.start(game)
    engine.action(game, { playerId: '2', type: 'call' })
    engine.action(game, { playerId: '3', type: 'call' })
    engine.action(game, { playerId: '1', type: 'raise', amount: 100 })
    engine.action(game, { playerId: '2', type: 'call', amount: 100 })
    engine.action(game, { playerId: '3', type: 'fold' })
    expect(game.round.showdown).toBeTruthy()
  })

  it('works with heads up both all in', () => {
    game.players = {
      '1': new PlayerModel({ username: '1', playerId: '1', stack: 1000 }),
      '2': new PlayerModel({ username: '2', playerId: '2', stack: 200 })
    }
    game.blinds = { small: 10, big: 20 }
    game.button = game.players['1']
    engine.start(game)
    engine.action(game, { playerId: '2', type: 'bet', amount: 50 })
    engine.action(game, { playerId: '1', type: 'raise', amount: 1000 })
    engine.action(game, { playerId: '2', type: 'call' })
    expect(game.round.showdown).toBeTruthy()
  })

  it('builds side pots when player bets all in', () => {
    game.players = {
      '1': new PlayerModel({ username: '1', playerId: '1', stack: 1000 }),
      '2': new PlayerModel({ username: '2', playerId: '2', stack: 1000 }),
      '3': new PlayerModel({ username: '3', playerId: '3', stack: 1000 }),
      '4': new PlayerModel({ username: '4', playerId: '4', stack: 200 })
    }
    game.blinds = { small: 10, big: 20 }
    game.button = game.players['4']
    engine.start(game)
    engine.action(game, { playerId: '4', type: 'bet', amount: 200 })
    engine.action(game, { playerId: '1', type: 'call' })
    engine.action(game, { playerId: '2', type: 'raise', amount: 800 })
    engine.action(game, { playerId: '3', type: 'call' })
    engine.action(game, { playerId: '1', type: 'call' })
    expect(game.round.pots.length).toBe(2)
    expect(game.round.pots[0].amount).toBe(800)
    expect(game.round.pots[1].amount).toBe(1800)
    expect(Object.keys(game.round.pots[0].players).length).toBe(4)
    expect(Object.keys(game.round.pots[1].players).length).toBe(3)
    expect(game.round.pots[1].players['4']).toBeUndefined()
  })

  it('builds side pots when two player with same stack goes all in', () => {
    game.players = {
      '1': new PlayerModel({ username: '1', playerId: '1', stack: 1000 }),
      '2': new PlayerModel({ username: '2', playerId: '2', stack: 200 }),
      '3': new PlayerModel({ username: '3', playerId: '3', stack: 200 }),
      '4': new PlayerModel({ username: '4', playerId: '4', stack: 1000 })
    }
    game.blinds = { small: 10, big: 20 }
    game.button = game.players['4']
    engine.start(game)
    engine.action(game, { playerId: '4', type: 'call' })
    engine.action(game, { playerId: '1', type: 'call' })
    engine.action(game, { playerId: '2', type: 'raise', amount: 200 })
    engine.action(game, { playerId: '3', type: 'call' })
    engine.action(game, { playerId: '4', type: 'raise', amount: 800 })
    engine.action(game, { playerId: '1', type: 'call' })
    expect(game.round.pots.length).toBe(2)
    expect(game.round.pots[0].amount).toBe(800)
    expect(game.round.pots[1].amount).toBe(1200)
    expect(Object.keys(game.round.pots[0].players).length).toBe(4)
    expect(Object.keys(game.round.pots[1].players).length).toBe(2)
    expect(game.round.pots[1].players['2']).toBeUndefined()
    expect(game.round.pots[1].players['3']).toBeUndefined()
  })

  it('plays out the game if all is all in', () => {
    game.players = {
      '1': new PlayerModel({ username: '1', playerId: '1', stack: 200 }),
      '2': new PlayerModel({ username: '2', playerId: '2', stack: 200 }),
      '3': new PlayerModel({ username: '3', playerId: '3', stack: 1000 }),
      '4': new PlayerModel({ username: '4', playerId: '4', stack: 200 })
    }
    game.blinds = { small: 10, big: 20 }
    game.button = game.players['4']
    engine.start(game)
    engine.action(game, { playerId: '4', type: 'raise', amount: 200 })
    engine.action(game, { playerId: '1', type: 'call' })
    engine.action(game, { playerId: '2', type: 'call' })
    engine.action(game, { playerId: '3', type: 'call' })
    expect(game.round.board.length).toBe(5)
    expect(game.round.showdown).toBeTruthy()
  })

  it('makes correct pots with all in and raise', () => {
    game.players = {
      '1': new PlayerModel({ username: '1', playerId: '1', stack: 1000 }),
      '2': new PlayerModel({ username: '2', playerId: '2', stack: 1000 }),
      '3': new PlayerModel({ username: '3', playerId: '3', stack: 1000 }),
      '4': new PlayerModel({ username: '4', playerId: '4', stack: 200 })
    }
    game.blinds = { small: 10, big: 20 }
    game.button = game.players['4']
    engine.start(game)
    engine.action(game, { playerId: '4', type: 'raise', amount: 200 })
    engine.action(game, { playerId: '1', type: 'raise', amount: 800 })
    engine.action(game, { playerId: '2', type: 'call' })
    engine.action(game, { playerId: '3', type: 'fold' })
    expect(game.round.pots.length).toBe(2)
    expect(game.round.pots[0].amount).toBe(620)
    expect(Object.keys(game.round.pots[0].players).length).toBe(3)
    expect(game.round.pots[1].amount).toBe(1200)
    expect(Object.keys(game.round.pots[1].players).length).toBe(2)
  })

  it('makes correct pots with all in and raise and fold next street', () => {
    game.players = {
      '1': new PlayerModel({ username: '1', playerId: '1', stack: 1000 }),
      '2': new PlayerModel({ username: '2', playerId: '2', stack: 1000 }),
      '3': new PlayerModel({ username: '3', playerId: '3', stack: 1000 }),
      '4': new PlayerModel({ username: '4', playerId: '4', stack: 200 })
    }
    game.blinds = { small: 10, big: 20 }
    game.button = game.players['4']
    engine.start(game)
    engine.action(game, { playerId: '4', type: 'raise', amount: 200 })
    engine.action(game, { playerId: '1', type: 'raise', amount: 800 })
    engine.action(game, { playerId: '2', type: 'call' })
    engine.action(game, { playerId: '3', type: 'fold' })

    engine.action(game, { playerId: '2', type: 'raise', amount: 100 })
    engine.action(game, { playerId: '1', type: 'fold' })

    expect(game.round.pots.length).toBe(2)
    expect(game.round.pots[0].amount).toBe(620)
    expect(game.round.pots[1].amount).toBe(1200)
  })

  it('makes correct pots with all in raise and re-raise', () => {
    game.players = {
      '1': new PlayerModel({ username: '1', playerId: '1', stack: 1000 }),
      '2': new PlayerModel({ username: '2', playerId: '2', stack: 2000 }),
      '3': new PlayerModel({ username: '3', playerId: '3', stack: 1000 }),
      '4': new PlayerModel({ username: '4', playerId: '4', stack: 200 })
    }
    game.blinds = { small: 10, big: 20 }
    game.button = game.players['4']
    engine.start(game)
    engine.action(game, { playerId: '4', type: 'raise', amount: 200 })
    engine.action(game, { playerId: '1', type: 'raise', amount: 800 })
    engine.action(game, { playerId: '2', type: 'raise', amount: 2000 })
    engine.action(game, { playerId: '3', type: 'fold' })
    engine.action(game, { playerId: '1', type: 'fold' })
    expect(game.round.pots.length).toBe(2)
    expect(game.round.pots[0].amount).toBe(620)
    expect(game.round.pots[1].amount).toBe(600)
  })

  it('creates a new pot for players with stack', () => {
    game.players = {
      '1': new PlayerModel({ username: '1', playerId: '1', stack: 200 }),
      '2': new PlayerModel({ username: '2', playerId: '2', stack: 1000 }),
      '3': new PlayerModel({ username: '3', playerId: '3', stack: 1000 }),
      '4': new PlayerModel({ username: '4', playerId: '4', stack: 200 })
    }
    game.blinds = { small: 10, big: 20 }
    game.button = game.players['4']
    engine.start(game)
    engine.action(game, { playerId: '4', type: 'raise', amount: 200 })
    engine.action(game, { playerId: '1', type: 'call' })
    engine.action(game, { playerId: '2', type: 'call' })
    engine.action(game, { playerId: '3', type: 'call' })

    engine.action(game, { playerId: '2', type: 'bet', amount: 100 })
    engine.action(game, { playerId: '3', type: 'call' })
    expect(game.round.pots.length).toBe(2)
    expect(game.round.pots[0].amount).toBe(800)
    expect(game.round.pots[1].amount).toBe(200)
    expect(Object.keys(game.round.pots[0].players).length).toBe(4)
    expect(Object.keys(game.round.pots[1].players).length).toBe(2)
  })

  it('builds side pots when player bets all in and someone folds', () => {
    game.players = {
      '1': new PlayerModel({ username: '1', playerId: '1', stack: 1000 }),
      '2': new PlayerModel({ username: '2', playerId: '2', stack: 1000 }),
      '3': new PlayerModel({ username: '3', playerId: '3', stack: 1000 }),
      '4': new PlayerModel({ username: '4', playerId: '4', stack: 200 })
    }
    game.blinds = { small: 10, big: 20 }
    game.button = game.players['4']
    engine.start(game)
    engine.action(game, { playerId: '4', type: 'bet', amount: 200 })
    engine.action(game, { playerId: '1', type: 'call' })
    engine.action(game, { playerId: '2', type: 'raise', amount: 800 })
    engine.action(game, { playerId: '3', type: 'fold' })
    engine.action(game, { playerId: '1', type: 'call' })
    expect(game.round.pots.length).toBe(2)
    expect(game.round.pots[0].amount).toBe(620)
    expect(game.round.pots[1].amount).toBe(1200)
    expect(Object.keys(game.round.pots[0].players).length).toBe(3)
    expect(Object.keys(game.round.pots[1].players).length).toBe(2)
    expect(game.round.pots[0].players['3']).toBeUndefined()
    expect(game.round.pots[1].players['4']).toBeUndefined()
    expect(game.round.pots[1].players['3']).toBeUndefined()
  })

  it('builds side pots when two short stacks goes all in', () => {
    game.players = {
      '1': new PlayerModel({ username: '1', playerId: '1', stack: 150 }),
      '2': new PlayerModel({ username: '2', playerId: '2', stack: 1000 }),
      '3': new PlayerModel({ username: '3', playerId: '3', stack: 1000 }),
      '4': new PlayerModel({ username: '4', playerId: '4', stack: 200 })
    }
    game.blinds = { small: 10, big: 20 }
    game.button = game.players['4']
    engine.start(game)
    engine.action(game, { playerId: '4', type: 'bet', amount: 200 })
    engine.action(game, { playerId: '1', type: 'call' })
    engine.action(game, { playerId: '2', type: 'raise', amount: 800 })
    engine.action(game, { playerId: '3', type: 'call' })
    expect(game.round.pots.length).toBe(3)
    expect(game.round.pots[0].amount).toBe(600)
    expect(game.round.pots[1].amount).toBe(150)
    expect(game.round.pots[2].amount).toBe(1200)
    expect(Object.keys(game.round.pots[0].players).length).toBe(4)
    expect(Object.keys(game.round.pots[1].players).length).toBe(3)
    expect(Object.keys(game.round.pots[2].players).length).toBe(2)
    expect(game.round.pots[1].players['1']).toBeUndefined()
    expect(game.round.pots[2].players['1']).toBeUndefined()
    expect(game.round.pots[2].players['4']).toBeUndefined()
  })
})
