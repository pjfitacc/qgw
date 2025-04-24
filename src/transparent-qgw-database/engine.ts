import { ZodError } from "zod";
import { apiSchema } from "./api-validation";
import { TransactionRequest, TransactionResponse } from "./transaction-request";
import { DirectAPI } from ".";

/*
A class that communicates w/ the TransparentQGW Database Engine @ POST URL: https://secure.quantumgateway.com/cgi/tqgwdbe.php
It acts as a middleman between this library and the engine.

Class Flow:
1. It sends a request to Db Engine containing the values it needs using the class's send(transactionRequest) method.
2. Gets back a response from the Engine 
3. Returns a formatted version of that response with the TransactionResponse object.
It's just a fancy way of calling a POST method for Quantum Gateway's Transparent QuantumGateway Database Engine resource.

Naming:
Since this class's functionality is similar to just POSTing to TransQGWDb Engine URL directly w/ cUrl or Postman,
we call it the TransparentDbEngine similar to how Quantum Gateway calls it the Engine.
If it walks like a duck...

The only difference between this class and the Official TransQGWDb Engine is that this class sends a better formatted response compared to POSTing directly.
*/
export class TransparentDbEngine {
  public gatewayLogin: string;
  static postURL: string = "https://secure.quantumgateway.com/cgi/tqgwdbe.php";

  constructor(gatewayLogin: string) {
    this.gatewayLogin = gatewayLogin;
  }

  send(
    transactionRequest: TransactionRequest | DirectAPI
  ): TransactionResponse {
    // TODO
    return TransactionResponse;
  }

  validate(
    directAPI: DirectAPI
  ): { success: true; data: DirectAPI } | { success: false; error: ZodError } {
    return apiSchema.safeParse(directAPI);
  }
}
