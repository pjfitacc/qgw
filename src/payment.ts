export type CreditCard = {
  trans_method: "CC";
  ccnum: string;
  ccmo: string;
  ccyr: string;
  CVV2: string;
  CVVtype: string;
};

export type ElectronicFundsTransfer = {
  trans_method: "EFT";
  aba: string;
  checkacct: string;
};

export type PaymentMethod = CreditCard | ElectronicFundsTransfer;
