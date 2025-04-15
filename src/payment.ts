export type BillingInfo = {
  address: string;
  zip: string;
  email: string;
  name?: string;
};

export type CreditCard = {
  method: "CREDIT_CARD";
  number: string;
  expirationMonth: string;
  expirationYear: string;
  cvv2: string;
  cvvType: string;
};

export type ElectronicFundsTransfer = {
  method: "EFT";
  aba: string;
  checkingAccountNumber: string;
};

export type PaymentMethod = CreditCard | ElectronicFundsTransfer;
