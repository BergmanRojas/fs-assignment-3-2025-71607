import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

import { Observable } from 'rxjs';
import { TokenService } from '../../../../core/auth/services/token.service';
import { Admin } from '../models/admin';
import { ResponseModel } from '../../../models/responseModel';


@Injectable({
  providedIn: 'root'
})
export class AdminService {
  apiUrl = 'http://localhost:60805/api/Users';
  constructor(private httpClient: HttpClient, private tokenService:TokenService) {}

  getAdminProfile(): Observable<Admin> {
    const userId: string = this.tokenService.getUserId();
    if (!userId) {
      throw new Error('Böyle bir kullanıcı bulunamadı');
    }
    return this.httpClient.get<Admin>(`${this.apiUrl}/${userId}`);
  }

  getAdminById(id: string): Observable<Admin> {
    return this.httpClient.get<Admin>(`${this.apiUrl}/${id}`);
  }

  getAdminByAuth(): Observable<Admin> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.get<Admin>(`${this.apiUrl}/GetFromAuth`, { headers: headers });
  }

  updateAdmin(admin: Admin): Observable<ResponseModel<Admin>> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.httpClient.put<ResponseModel<Admin>>(`${this.apiUrl}/FromAuth`, admin,{ headers: headers });
  }
}
