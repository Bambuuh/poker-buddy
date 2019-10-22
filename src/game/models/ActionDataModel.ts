export interface ActionDataModel {
  playerId: string;
  type: 'bet' | 'raise' | 'call' | 'fold' | 'check';
  amount?: number;
}