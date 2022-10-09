import { InjectionToken } from "@angular/core";
import { environment } from "src/environments/environment";
import Web3 from "web3";

export const WEB3 = new InjectionToken<any>('web3', {
  providedIn: 'root',
  // factory: () => new Web3(Web3.givenProvider)
  factory: () => new Web3(new Web3.providers.HttpProvider(environment.rpcUrl[0]))
})