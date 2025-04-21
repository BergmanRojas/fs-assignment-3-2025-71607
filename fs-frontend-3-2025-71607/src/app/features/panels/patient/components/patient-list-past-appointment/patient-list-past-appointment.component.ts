import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PatientSidebarComponent } from '../sidebar/psidebar.component';
import { Appointment } from '../../../../appointments/models/appointmentModel';
import { AppointmentService } from '../../../../appointments/services/appointment.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { ResponseModel } from '../../../../models/responseModel';
import { ReportService } from '../../../../reports/services/report.service';
import { TokenComponent } from '../../../../../shared/components/token/token.component';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-patient-list-past-appointment',
  standalone: true,
  imports: [CommonModule, PatientSidebarComponent, TokenComponent],
  templateUrl: './patient-list-past-appointment.component.html',
  styleUrl: './patient-list-past-appointment.component.scss',
})
export class PatientListPastAppointmentComponent {
  appointments: Appointment[] = [];
  hasReportMap: { [key: number]: boolean } = {};
  pageIndex: number = 0;
  pageSize: number = 100;
  todayDate: Date = new Date();

  constructor(
    private patientService: PatientService,
    private appointmentService: AppointmentService,
    private reportService: ReportService,
    private toastrService: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getPatientAppointments();
  }

  getPatientAppointments(): void {
    this.patientService.getPatientProfile().subscribe(
      (patient) => {
        const patientId = patient.id.toString();
        this.appointmentService
          .getPatientAppointments(patientId, this.pageIndex, this.pageSize)
          .subscribe(
            (response: ResponseModel<Appointment>) => {
              this.appointments = response.items.filter((appointment) => {
                const appointmentDate = new Date(appointment.date);
                return (
                  appointmentDate < this.todayDate ||
                  (appointmentDate.getTime() === this.todayDate.getTime() &&
                    appointment.time <=
                      this.todayDate.toTimeString().slice(0, 5))
                );
              });
            }
          );
      }
    );
  }

  public viewReport(appointmentId: number) {
    this.reportService
      .getByAppointmentId(appointmentId)
      .subscribe((response) => {
        let reportId = response.id;
        this.router.navigate(['patient-report-detail', reportId]);
      });
  }
}
