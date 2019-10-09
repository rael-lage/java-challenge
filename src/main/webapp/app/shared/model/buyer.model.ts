export interface IBuyer {
  id?: number;
  name?: string;
  email?: string;
  cpf?: number;
}

export const defaultValue: Readonly<IBuyer> = {};
