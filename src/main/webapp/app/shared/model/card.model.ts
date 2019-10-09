import { Moment } from 'moment';

export interface ICard {
  id?: number;
  holderName?: string;
  number?: string;
  expirationDate?: Moment;
  cvv?: number;
}

export const defaultValue: Readonly<ICard> = {};
