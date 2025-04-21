import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor() {}

  decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (Error) {
      return null;
    }
  }

  getUserId(): string {
    const token = localStorage.getItem('token');
    if (!token) {
      return '';
    }

    const decodedToken: any = this.decodeToken(token);
    if (
      !decodedToken ||
      !decodedToken[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
      ]
    ) {
      return '';
    }

    const userId =
      decodedToken[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
      ];
    return userId;
  }

  getUserEmail(): string {
    const token = localStorage.getItem('token');
    if (!token) {
      return '';
    }

    const decodedToken: any = this.decodeToken(token);
    if (
      !decodedToken ||
      !decodedToken[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
      ]
    ) {
      return '';
    }

    const userEmail =
      decodedToken[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
      ];
    return userEmail;
  }

  getUserRole() {
    const token = localStorage.getItem('token');
    if (!token) {
      return '';
    }

    const decodedToken: any = this.decodeToken(token);
    if (
      !decodedToken ||
      !decodedToken[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ]
    ) {
      return '';
    }

    const userRoles =
      decodedToken[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ];

    return userRoles;
  }

  getTokenExpirationDate(): Date | null {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('');
    }

    const decodedToken: any = this.decodeToken(token);
    if (!decodedToken || !decodedToken.exp) {
      throw new Error('');
    }

    const expirationDate = new Date(decodedToken.exp * 1000);
    return expirationDate;
  }
}
