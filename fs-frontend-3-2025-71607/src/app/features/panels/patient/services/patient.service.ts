import { Injectable } from '@angular/core';
import { HttpClient ,HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { TokenService } from '../../../../core/auth/services/token.service';
import { Patient } from '../models/patientModel';
import { ResponseModel } from '../../../models/responseModel';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  baseApiUrl = 'http://localhost:60805/api';
  apiUrl = 'http://localhost:60805/api/Patients';
  registerPatientUrl = 'http://localhost:60805/api/Auth/Register/Patient';
  constructor(private httpClient: HttpClient,private tokenService:TokenService) {}

  getByPatientId(
    id: string,
    pageIndex: number,
    pageSize: number
  ): Observable<Patient> {
    let params = new HttpParams()
     .set('id', id);
    return this.httpClient.get<Patient>(`${this.apiUrl}/${id}`);
  }


  getPatients(
    pageIndex: number,
    pageSize: number
  ): Observable<ResponseModel<Patient>> {
    let params = new HttpParams()
      .set('PageIndex', pageIndex.toString())
      .set('PageSize', pageSize.toString());

    return this.httpClient.get<ResponseModel<Patient>>(this.apiUrl, { params });
  }

  addPatient(patient: any): Observable<Patient> {
    return this.httpClient.post<any>(this.registerPatientUrl, patient);
  }

  updatePatient(patient: Patient): Observable<ResponseModel<Patient>> {
    return this.httpClient.put<ResponseModel<Patient>>(this.apiUrl, patient);
  }

  deletePatient(id:string): Observable<ResponseModel<any>> {
    return this.httpClient.delete<ResponseModel<any>>(`${this.apiUrl}/${id}`);
  }

  getPatientProfile(): Observable<Patient> {
    const patientId: string = this.tokenService.getUserId();
    if (!patientId) {
      throw new Error('Böyle bir kullanıcı bulunamadı');
    }
    return this.httpClient.get<Patient>(`${this.apiUrl}/${patientId}`);
  }

}


