export type BillingInfo = {
  address: string;
  zip: string;
  email: string;
  name?: string;
};

export type CreditCard = {
  number: string;
  expirationMonth: string;
  expirationYear: string;
  cvv2: string;
  cvvType: string;
};

export type ElectronicFundsTransfer = {
  aba: string;
  checkingAccountNumber: string;
};
