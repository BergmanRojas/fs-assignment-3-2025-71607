import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Doctor } from '../models/doctor';
import { ResponseModel } from '../../../models/responseModel';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  apiUrl = 'http://localhost:60805/api/Doctors';
  registerDoctorUrl = 'http://localhost:60805/api/Auth/Register/Doctor';

  constructor(private httpClient: HttpClient) {}

  private decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      return null;
    }
  }

  getDoctors(pageIndex: number, pageSize: number): Observable<ResponseModel<Doctor>> {
    const params = new HttpParams()
      .set('PageIndex', pageIndex.toString())
      .set('PageSize', pageSize.toString());

    return this.httpClient.get<ResponseModel<Doctor>>(this.apiUrl, { params });
  }

  getDoctorById(id: string): Observable<Doctor> {
    return this.httpClient.get<Doctor>(`${this.apiUrl}/${id}`);
  }

  addDoctor(doctor: any): Observable<Doctor> {
    return this.httpClient.post<Doctor>(this.registerDoctorUrl, doctor);
  }

  updateDoctor(doctor: Doctor): Observable<ResponseModel<Doctor>> {
    return this.httpClient.put<ResponseModel<Doctor>>(this.apiUrl, doctor);
  }

  deleteDoctor(id: string): Observable<ResponseModel<any>> {
    return this.httpClient.delete<ResponseModel<any>>(`${this.apiUrl}/${id}`);
  }

  getDoctorProfile(): Observable<Doctor> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const decodedToken: any = this.decodeToken(token);
    const doctorId = decodedToken?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    if (!doctorId) {
      throw new Error('Invalid token or missing doctor ID');
    }

    return this.httpClient.get<Doctor>(`${this.apiUrl}/${doctorId}`);
  }
}
