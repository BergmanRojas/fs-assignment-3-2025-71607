import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginModel } from '../models/loginModel';
import { Observable } from 'rxjs';
import { ResponseTokenModel } from '../models/responseTokenModel';
import { RegisterModel } from '../models/registerModel';
import { TokenModel } from '../models/tokenModel';
import { User } from '../models/user-model';



@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = 'http://localhost:60805/api/Auth';

  constructor(private httpClient: HttpClient) {}

  login(loginModel: LoginModel): Observable<ResponseTokenModel> {
    return this.httpClient.post<ResponseTokenModel>(`${this.apiUrl}/Login`, loginModel);
  }

  // Patient register
  register(registerModel: RegisterModel): Observable<TokenModel> {
    return this.httpClient.post<TokenModel>(`${this.apiUrl}/Register/Patient`, registerModel);
  }

  verifyEmail(activationKey: string){
    const url = `${this.apiUrl}/VerifyEmailAuthenticator?ActivationKey=${encodeURIComponent(activationKey)}`;
    return this.httpClient.get(url);
  }
  
  
  isAuthenticated() {
    if (localStorage.getItem('token')) {
      return true;
    } else {
      return false;
    }
  }
  logout(): void {
    localStorage.removeItem('token');
  }


  ChangePassword(User:User): Observable<User> {
    let newPath = 'http://localhost:60805/api/Users/ChangePassword';
    return this.httpClient.put<User>(`${newPath}`, User);
  }
}
