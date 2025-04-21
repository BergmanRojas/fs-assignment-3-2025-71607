import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class SmsService {
    
    private apiUrl = 'http://localhost:60805/api/Sms'; // Gerçek SMS servisinin URL'si
  
    constructor(private http: HttpClient) { }
  
    sendSms(phoneNumber: string, message: string): Observable<any> {
      const body = { phoneNumber, message };
      return this.http.post<any>(this.apiUrl, body);
    }
  }