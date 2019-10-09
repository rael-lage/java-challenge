import { IClient } from 'app/shared/model/client.model';
import { IBuyer } from 'app/shared/model/buyer.model';
import { ICard } from 'app/shared/model/card.model';
import { IBoleto } from 'app/shared/model/boleto.model';
import { PaymentType } from 'app/shared/model/enumerations/payment-type.model';
import { PaymentStatus } from 'app/shared/model/enumerations/payment-status.model';

export interface IPayment {
  id?: number;
  amount?: number;
  type?: PaymentType;
  status?: PaymentStatus;
  client?: IClient;
  buyer?: IBuyer;
  card?: ICard;
  boleto?: IBoleto;
}

export const defaultValue: Readonly<IPayment> = {};
