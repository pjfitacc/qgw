import { ZodError } from "zod";
import { apiSchema } from "./api/validation";
import { DirectAPI } from "./api";
import TransactionError from "../errors/transaction-error";
import { postToServer } from "../utils/transparent-qgw-db-engine";
import { AxiosError } from "axios";
import { CustomIssue } from "../errors/custom-error";
import { TransactionErrorCode } from "../errors/types";
import { TransactionRequest } from "./transaction/request";
import { TransactionResponse } from "./transaction/response";

/**
 * ### Description
 *  The class that communicates w/ the TransparentQGW Database Engine \@ POST URL: https://secure.quantumgateway.com/cgi/tqgwdbe.php
 *  It acts as a middleman between this library and the engine.
 *
 *  Class Flow:
 *  1. It sends a request to Db Engine containing the values it needs using the class's send(transactionRequest) method.
 *  2. Gets back a response from the Engine
 *  3. Returns a formatted version of that response with the TransactionResponse object.
 *  It's just a fancy way of calling a POST method for Quantum Gateway's Transparent QuantumGateway Database Engine resource.
 *
 *  Naming:
 *  Since this class's functionality is similar to just POSTing to TransQGWDb Engine URL directly w/ cUrl or Postman,
 *  we call it the TransparentDbEngine similar to how Quantum Gateway calls it the Engine.
 *  If it walks like a duck...
 *
 *  One big difference between this class and the Official TransQGWDb Engine is that this class sends a better formatted response compared to POSTing directly.
 *
 */
export class TransparentDbEngine {
  public gatewayLogin: string;
  static postURL: string = "https://secure.quantumgateway.com/cgi/tqgwdbe.php";
  public strictMode: boolean = true; // Strict Mode set to true, makes library validate your input before sending it to the server.

  constructor(gatewayLogin: string) {
    this.gatewayLogin = gatewayLogin;
  }

  async send(
    transactionRequest: TransactionRequest | DirectAPI
  ): Promise<TransactionResponse> {
    if (transactionRequest instanceof TransactionRequest) {
      transactionRequest = transactionRequest.toAPI();
    }

    // Set the gateway login to the Quantum Gateway Account ID
    // This is required for all transactions
    transactionRequest.gwlogin = this.gatewayLogin;

    const validTransaction = this.validate(transactionRequest);

    if (!validTransaction.success) {
      throw new TransactionError({
        message: validTransaction.error.message,
        issues: validTransaction.error.issues,
        code: "ERR_PARSE",
      });
    }

    const form = validTransaction.data;

    try {
      const serverResponse = await postToServer(form);
      return new TransactionResponse(serverResponse);
    } catch (error: unknown) {
      throw this.serverError(error);
    }
  }

  serverError(error: unknown): TransactionError {
    let errorMessage = "";
    let transactionIssues = [] as CustomIssue[];
    let errorCode: TransactionErrorCode = "ERR_SERVER_RESPONSE";

    switch (true) {
      case error instanceof AxiosError:
        const serverError = error.response?.data;
        if (serverError) {
          errorMessage = serverError.message;
        }
        break;
      case error instanceof TransactionError:
        errorMessage = error.message;
        errorCode = error?.code || "ERR_SERVER_RESPONSE";
        if (error.issues.length > 0) {
          transactionIssues = error.issues;
        }
        break;
      case error instanceof Error:
        errorMessage = error.message;
        break;
      default:
        errorMessage = "An unexpected server error occurred";
    }

    throw new TransactionError({
      message: errorMessage,
      issues: transactionIssues,
      code: errorCode,
    });
  }

  validate(
    directAPI: DirectAPI
  ): { success: true; data: DirectAPI } | { success: false; error: ZodError } {
    if (!this.strictMode) {
      return { success: true, data: directAPI };
    }
    return apiSchema.safeParse(directAPI);
  }
}
