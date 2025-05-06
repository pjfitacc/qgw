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
 *  - overrideRecurringPrice: override_recur "Y"
 *  - initialAmount: initial_amount
 *  - recurCycles: recur_times
 *  - overrideRecurringDay: OverRideRecureDay "Y" | "N"
 */
export type RecurringOptionsFields = {
  /**
   * The recurring recipe ID that this transaction will be associated with. Recurring Recipe IDs are something that you create in the Quantum Gateway website under Processing Tools =\> Recurring Billing =\> New Recipe. Or you can use an existing recipe ID.
   * This can be found in Processing Tools =\> Recurring Billing =\> View Recipes
   */
  rid: string;

  /**
   * The amount of times this transaction will recur.
   */
  recurCycles?: number;

  /**
   * Whether to override a transaction recipe id's recurring amount.
   * This setting only applies to recurring recipes with the "Honor Trans Amount" amount setting set to "N".
   * You can see this in the quantum gateway settings under Processing Tools =\> Recurring Billing =\> View Recipes
   *    - You'll then see a table of all of the recipes you've created and a column with header Honor Trans Amount.
   *    - If Honor Trans Amount is "Y" then the transaction (tx) will ALWAYS use the transaction's set amount, regardless of overrideRecurringPrice.
   *    - If the value is "N," then the tx will only use the tx's set amount if overrideRecurringPrice is set to "Y". Otherwise, it will use the recipe's default recurring amount in its settings.
   * You can change a specific recipe's value by going to the recipe's edit page and clicking the checkbox "Honor Transaction Amount instead of Recurring Amount Above" on or off.
   *
   */
  overrideRecurringPrice?: boolean;

  /**
   * If this is set to a number, then this is the first payment that will be charged. This number is separate from the recurring amount.
   * The recurring amount will be either the amount set in the transaction or the amount set in the recipe.
   * The choice for either is dependent on your settings and the value of override_recur.
   */
  initialAmount?: number;

  /**
   * Override the default recurring day for the recipe id.
   * If this is set to true, then the recurring day will be set to the day of the month that this transaction is being processed.
   */
  overrideRecurringDay?: boolean;
};

/**
 * ### Description
 *  Used to set quantum gateway's recurring options for a transaction.
 *
 */
export class RecurringOptions {
  /** @hidden */
  public directApiFields: DirectApiRecurringFields;

  constructor(recurringOptionsFields?: RecurringOptionsFields) {
    if (recurringOptionsFields === undefined) {
      this.directApiFields = {};
      return;
    }

    this.directApiFields = {
      RID: recurringOptionsFields.rid,
      initial_amount: recurringOptionsFields.initialAmount?.toString(),
      recur_times: recurringOptionsFields.recurCycles?.toString(),
      OverRideRecureDay: toggleYesOrNO(
        recurringOptionsFields.overrideRecurringDay
      ),
    };

    if (recurringOptionsFields.overrideRecurringPrice) {
      this.directApiFields.override_recur = "Y";
    }
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
