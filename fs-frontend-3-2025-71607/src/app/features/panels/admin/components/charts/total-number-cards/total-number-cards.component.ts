import { Component, OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { AppointmentService } from '../../../../../appointments/services/appointment.service';
import { ReportService } from '../../../../../reports/services/report.service';
import { AdminSidebarComponent } from '../../sidebar/adminSidebar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../../../patient/services/patient.service';
import { DoctorService } from '../../../../doctor/services/doctor.service';

@Component({
  selector: 'app-total-number-cards',
  standalone: true,
  templateUrl: './total-number-cards.component.html',
  styleUrls: ['./total-number-cards.component.scss'],
  imports: [FormsModule, CommonModule, NgxChartsModule, AdminSidebarComponent],
})
export class TotalNumberCardsComponent implements OnInit {
  single: any[] = [];
  view: [number, number] = [600, 300];

  colorScheme: any = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5'],
  };

  cardColor: string = 'fire';
  pageIndex: number = 0;
  pageSize: number = 1000;

  constructor(
    private doctorService: DoctorService,
    private patientService: PatientService,
    private appointmentService: AppointmentService,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.doctorService
      .getDoctors(this.pageIndex, this.pageSize)
      .subscribe((data) => {
        this.addSingleData('Total Doctors', data.count);
      });

    this.patientService
      .getPatients(this.pageIndex, this.pageSize)
      .subscribe((data) => {
        this.addSingleData('Total Patients', data.count);
      });

    this.appointmentService
      .getAllAppointments(this.pageIndex, this.pageSize)
      .subscribe((data) => {
        this.addSingleData('Total Appointments', data.count);
      });

    this.reportService
      .getList(this.pageIndex, this.pageSize)
      .subscribe((data) => {
        this.addSingleData('Total Reports', data.count);
      });
  }

  addSingleData(name: string, value: number): void {
    this.single.push({ name, value });
    this.single = [...this.single];
  }

  logData(): void {}

  onSelect(event: any): void {}
}
