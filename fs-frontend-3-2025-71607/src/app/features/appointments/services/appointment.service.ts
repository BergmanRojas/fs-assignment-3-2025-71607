import { Injectable } from '@angular/core';
import { Appointment } from '../models/appointmentModel';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ResponseModel } from '../../models/responseModel';
import { Observable } from 'rxjs';
import { AppointmentForPatientPanel } from '../models/appointmentforpatientpanel';
import { CreateAppointment } from '../models/createAppointment';
import { CreateAppointmentResponse } from '../models/createAppointmentResponse';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {

  apiUrl = 'http://localhost:60805/api/Appointments';

  constructor(private httpClient: HttpClient) { }

  getAllAppointments(
    pageIndex: number,
    pageSize: number
  ): Observable<ResponseModel<Appointment>> {
    const params = new HttpParams()
      .set('PageIndex', pageIndex.toString())
      .set('PageSize', pageSize.toString());

    return this.httpClient.get<ResponseModel<Appointment>>(
      this.apiUrl,
      { params }
    );
  }

  getDoctorAppointments(
    doctorId: string,
    pageIndex: number,
    pageSize: number
  ): Observable<ResponseModel<Appointment>> {
    const params = new HttpParams()
      .set('PageIndex', pageIndex.toString())
      .set('PageSize', pageSize.toString())
      .set('doctorId', doctorId);

    return this.httpClient.get<ResponseModel<Appointment>>(
      `${this.apiUrl}/getByDoctorId`,
      { params }
    );
  }

  getPatientAppointments(
    patientId: string,
    pageIndex: number,
    pageSize: number
  ): Observable<ResponseModel<Appointment>> {
    const params = new HttpParams()
      .set('PageIndex', pageIndex.toString())
      .set('PageSize', pageSize.toString())
      .set('patientId', patientId);

    return this.httpClient.get<ResponseModel<Appointment>>(
      `${this.apiUrl}/getByPatientId`,
      { params }
    );
  }

  getAppointmentById(appointmentId: number): Observable<Appointment> {
    return this.httpClient.get<Appointment>(`${this.apiUrl}/${appointmentId}`);
  }

  getByDoctorDate(
    pageIndex: number,
    pageSize: number,
    doctorId: string,
    date: string
  ): Observable<ResponseModel<AppointmentForPatientPanel>> {
    const params = new HttpParams()
      .set('PageIndex', pageIndex.toString())
      .set('PageSize', pageSize.toString())
      .set('doctorId', doctorId)
      .set('date', date);

    return this.httpClient.get<ResponseModel<AppointmentForPatientPanel>>(
      `${this.apiUrl}/getByDoctorDate`,
      { params }
    );
  }

  createAppointment(appointment: CreateAppointment): Observable<CreateAppointmentResponse> {
    return this.httpClient.post<CreateAppointmentResponse>(this.apiUrl, appointment);
  }

  deleteAppointment(appointmentId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${appointmentId}`);
  }

  getAppointmentsByDoctorAndDate(doctorId: string, date: string): Observable<{ items: AppointmentForPatientPanel[] }> {
    return this.httpClient.get<{ items: AppointmentForPatientPanel[] }>(
      `${this.apiUrl}/appointments/by-doctor/${doctorId}?date=${date}`
    );
  }
  updateAppointment(
    appointmentId: number,
    appointment: Appointment
  ): Observable<ResponseModel<Appointment>> {
    return this.httpClient.put<ResponseModel<Appointment>>(
      `${this.apiUrl}/${appointmentId}`,
      appointment
    );
  }
}
