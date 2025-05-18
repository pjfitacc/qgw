import {
  Expose,
  Type,
  plainToInstance,
  instanceToPlain,
} from "class-transformer";
import { DirectAPI } from "../api";
import { toggleYesOrNO } from "../../utils/transparent-qgw-db-engine";

/**
 * ### Description
 *  Some of the available recurring options you can set for a Transparent API Transaction.
 *  rid is the only required field and is based on Quantum Gateway's Recurring Recipes.
 *  The rest are to further configure the particular transaction's recurring settings.
 *
 * @privateRemarks
 * RecurringOptionsFields class to DirectAPI mapping:
 *  - rid: RID
 *  - overrideRecurringPrice: override_recur "Y"
 *  - initialAmount: initial_amount
 *  - recurCycles: recur_times
 *  - overrideRecurringDay: OverRideRecureDay "Y" | "N"
 */
export class RecurringOptionsFieldsModel {
  /**
   * The recurring recipe ID that this transaction will be associated with.
   */
  @Expose()
  rid!: string;

  /**
   * The amount of times this transaction will recur.
   */
  @Expose()
  recurCycles?: number;

  /**
   * Whether to override a transaction recipe id's recurring amount.
   */
  @Expose()
  overrideRecurringPrice?: boolean;

  /**
   * If set, this is the first payment that will be charged.
   */
  @Expose()
  initialAmount?: number;

  /**
   * Override the default recurring day for the recipe id.
   */
  @Expose()
  overrideRecurringDay?: boolean;
}

export type RecurringOptionsFields = RecurringOptionsFieldsModel;

/**
 * ### Description
 *  Used to set quantum gateway's recurring options for a transaction.
 */
export class RecurringOptions {
  /** @hidden */
  public directApiFields: DirectApiRecurringFields;

  @Type(() => RecurringOptionsFieldsModel)
  @Expose()
  public recurringOptionsFields: RecurringOptionsFieldsModel;

  constructor(
    recurringOptionsFields: RecurringOptionsFieldsModel = new RecurringOptionsFieldsModel()
  ) {
    this.recurringOptionsFields = recurringOptionsFields;

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

  static fromJSON(json: any): RecurringOptions {
    const fields = plainToInstance(RecurringOptionsFieldsModel, json);
    return new RecurringOptions(fields);
  }

  toJSON(): any {
    return instanceToPlain(this.recurringOptionsFields);
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
