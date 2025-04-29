import { DirectAPI } from "../api";
import { toggleYesOrNO } from "../../utils/transparent-qgw-db-engine";

/**
 *
 */
export type RecurringOptionsFields = {
  rid: string;
  recurCycles?: number;
  overrideRecurringPrice?: boolean;
  initialAmount?: number;
  overrideRecurringDay?: boolean;
};

/**
 * RecurringOptions:
 * rid: RID
 *  - if there are recurring options present, this class must ensure that RID exists.
 * overrideRecurringPrice: override_recur "Y" | "N"
 * initialAmount: initial_amount
 * recurCycles: recur_times
 * overrideRecurringDay: OverRideRecureDay "Y" | "N"
 *
 * @class RecurringOptions
 */
export class RecurringOptions {
  public directApiFields: DirectApiRecurringFields;
  constructor(recurringOptionsFields?: RecurringOptionsFields) {
    if (recurringOptionsFields === undefined) {
      this.directApiFields = {};
      return;
    }

    this.directApiFields = {
      RID: recurringOptionsFields.rid,
      override_recur: toggleYesOrNO(
        recurringOptionsFields.overrideRecurringPrice
      ),
      initial_amount: recurringOptionsFields.initialAmount?.toString(),
      recur_times: recurringOptionsFields.recurCycles?.toString(),
      OverRideRecureDay: toggleYesOrNO(
        recurringOptionsFields.overrideRecurringDay
      ),
    };
  }
}

export type DirectApiRecurringFields = Pick<
  DirectAPI,
  | "RID"
  | "override_recur"
  | "initial_amount"
  | "recur_times"
  | "OverRideRecureDay"
>;
