import { WinnerModel } from './WinnerModel';
import { PlayerCollection } from './PlayerCollection';

export class PotModel {
  public players: PlayerCollection;
  public amount = 0;
  public winners: WinnerModel[] = [];

  constructor(players: PlayerCollection) {
    this.players = { ...players };
  }
}
