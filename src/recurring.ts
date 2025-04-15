// TODO: Define Default transactionOptions & recurringOptions
export type RecurringOptions = {
  rid: string;
  initialAmount: number;
  recurCycles: number;
  overrideRecurringPrice: boolean;
  overrideRecurringDay: boolean;
};
