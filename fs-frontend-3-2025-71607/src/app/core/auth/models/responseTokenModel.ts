import { TokenModel } from "./tokenModel";


export interface ResponseTokenModel {
  accessToken: TokenModel;
  requiredAuthenticatorType: string | null;
}

