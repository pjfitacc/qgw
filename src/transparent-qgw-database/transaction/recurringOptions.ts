import { DirectAPI } from "..";

// RecurringOptions:
// rid: RID
//  - if there are recurring options present, this class must ensure that RID exists.
// overrideRecurringPrice: override_recur "Y" | "N"
// initialAmount: initial_amount
// recurCycles: recur_times
// overrideRecurringDay: OverRideRecureDay "Y" | "N"
export class RecurringOptions {
  public fields: RecurringFields;
  constructor(
    public rid: string,
    public recurCycles: number = 0,
    public overrideRecurringPrice?: boolean,
    public initialAmount?: number,
    public overrideRecurringDay?: boolean
  ) {
    this.fields = {
      RID: rid,
      override_recur: overrideRecurringPrice ? "Y" : "N",
      initial_amount: initialAmount?.toString(),
      recur_times: recurCycles.toString(),
      OverRideRecureDay: overrideRecurringDay ? "Y" : "N",
    };
  }
}

export type RecurringFields = Pick<
  DirectAPI,
  | "RID"
  | "override_recur"
  | "initial_amount"
  | "recur_times"
  | "OverRideRecureDay"
>;
