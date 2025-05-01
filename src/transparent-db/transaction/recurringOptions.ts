import { DirectAPI } from "../api";
import { toggleYesOrNO } from "../../utils/transparent-qgw-db-engine";

/**
 * ### Description
 *  Some of the available recurring options you can set for a Transparent API Transaction.
 *  rid is the only required field and is based on Quantum Gateway's Recurring Recipes.
 *  The rest are to further configure the particular transaction's recurring settings.
 *  Other configurable options are available throughout various classes within the TransactionRequest class.
 *
 * @privateRemarks
 * RecurringOptionsFields class to DirectAPI mapping:
 *  - rid: RID
 *  - overrideRecurringPrice: override_recur "Y" | "N"
 *  - initialAmount: initial_amount
 *  - recurCycles: recur_times
 *  - overrideRecurringDay: OverRideRecureDay "Y" | "N"
 */
export type RecurringOptionsFields = {
  rid: string;
  recurCycles?: number;
  overrideRecurringPrice?: boolean;
  initialAmount?: number;
  overrideRecurringDay?: boolean;
};

/**
 * ### Description
 *  Used to set quantum gateway's recurring options for a transaction.
 *
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
