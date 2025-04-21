import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseReport } from '../models/responseReport';
import { ResponseModel } from '../../models/responseModel';
import { Observable } from 'rxjs';
import { UpdateRequestReport } from '../models/update-request-report';
import { AddReport } from '../models/addReport';
import { Report } from '../models/report';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private httpClient:HttpClient) { }
  apiUrl="http://localhost:60805/api/Reports/"


  getDoctorReports(pageIndex:number,pageSize:number,doctorId:string):Observable<ResponseModel<ResponseReport>>
  {
    let newPath=this.apiUrl+'getByDoctorId'
    let params = new HttpParams()
   .set('PageIndex', pageIndex.toString())
   .set('PageSize', pageSize.toString())
   .set('doctorId',doctorId);

   return this.httpClient.get<ResponseModel<ResponseReport>>(newPath,{params});
  }

  getPatientReports(pageIndex:number,pageSize:number,patientId:string):Observable<ResponseModel<ResponseReport>>
  {
    let newPath=this.apiUrl+'getByPatientId'
    let params = new HttpParams()
   .set('PageIndex', pageIndex.toString())
   .set('PageSize', pageSize.toString())
   .set('patientId',patientId);

   return this.httpClient.get<ResponseModel<ResponseReport>>(newPath,{params});
  }

  getReportDetails(reportId: number): Observable<ResponseReport> {
    const url = `${this.apiUrl}${reportId}`; // /Reports/1 gibi URL oluşturur

    return this.httpClient.get<ResponseReport>(url);
  }


  updateReport(report: UpdateRequestReport): Observable<Report> {
    return this.httpClient.put<Report>(this.apiUrl, report);
  }

  addReport(addReport:AddReport):Observable<Report>
  {
       return this.httpClient.post<Report>(this.apiUrl,addReport);
  }


   getByAppointmentId(appointmentid:number):Observable<Report>{
    let newPath=this.apiUrl+'appointmentid'
    let params = new HttpParams()
    .set('appointmentid',appointmentid);

    return this.httpClient.get<Report>(newPath,{params});
   }


   getList(pageIndex:number,pageSize:number):Observable<ResponseModel<ResponseReport>>
   {

    let params = new HttpParams()
    .set('PageIndex', pageIndex.toString())
    .set('PageSize', pageSize.toString())

    return this.httpClient.get<ResponseModel<ResponseReport>>(this.apiUrl,{params});
   }

   deleteReport(reportId: number):Observable<Report>
   {
    const url = `${this.apiUrl}${reportId}`; // /Reports/1 gibi URL oluşturur

    return this.httpClient.delete<Report>(url);
   }



}
