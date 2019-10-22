import { GameModel } from "../models/GameModel";
import { getPlayersWithStack } from "../player-utilities";
import { DeckHandler } from "../deck/deck-handler";
import { PlayerModel } from "../models/PlayerModel";
import { HistoryAction } from "../models/HistoryModel";

export class TexasHoldem {
  private deckHandler = new DeckHandler();
  public streets = 3;

  public deal(game: GameModel): void {
    const { players } = game;
    const playersWithStack = getPlayersWithStack(players);
    game.deck = this.deckHandler.createDeck();
    const playerIds = Object.keys(playersWithStack);
    playerIds
      .filter(id => !playersWithStack[id].isOffline)
      .forEach(id => this.dealHand(playersWithStack[id], game));
  }

  public play(game: GameModel): { street: number, action: HistoryAction} {
    switch (game.round.currentStreet) {
      case 0:
        this.deal(game);
        game.round.currentStreet += 1
        return { street: game.round.currentStreet, action: 'new hand'}
      case 1:
        this.flop(game);
        game.round.currentStreet += 1
        return { street: game.round.currentStreet, action: 'flop'}
      case 2:
        this.turn(game);
        game.round.currentStreet += 1
        return { street: game.round.currentStreet, action: 'turn'}
      case 3:
        this.river(game);
        game.round.currentStreet += 1
        return { street: game.round.currentStreet, action: 'river'}
      default:
        game.round.currentStreet += 1
        return { street: game.round.currentStreet, action: 'river'}
    }
  }

  public dealHand(player: PlayerModel, game: GameModel) {
    player.cards = [
      this.deckHandler.takeCard(game.deck),
      this.deckHandler.takeCard(game.deck)
    ];
  }

  public reset(game: GameModel) {
    game.round.currentStreet = 0;
  }

  public flop(game: GameModel) {
    if (!game.round.board) {
      game.round.board = [];
    }
    game.round.board.push(
      ...[
        this.deckHandler.takeCard(game.deck),
        this.deckHandler.takeCard(game.deck),
        this.deckHandler.takeCard(game.deck)
      ]
    );
  }

  public turn(game: GameModel) {
    game.round.board.push(this.deckHandler.takeCard(game.deck));
  }

  public river(game: GameModel) {
    game.round.board.push(this.deckHandler.takeCard(game.deck));
  }
}
