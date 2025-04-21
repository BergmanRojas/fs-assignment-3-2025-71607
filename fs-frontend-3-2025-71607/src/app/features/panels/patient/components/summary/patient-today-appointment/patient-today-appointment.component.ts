import { Component } from '@angular/core';
import { Appointment } from '../../../../../appointments/models/appointmentModel';
import { ResponseModel } from '../../../../../models/responseModel';
import { AppointmentService } from '../../../../../appointments/services/appointment.service';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../../services/patient.service';

@Component({
  selector: 'app-patient-today-appointment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-today-appointment.component.html',
  styleUrl: './patient-today-appointment.component.scss'
})
export class PatientTodayAppointmentComponent {
  appointments: Appointment[] = [];
  pageIndex: number = 0;
  pageSize: number = 100;
  todayDate: Date = new Date();

  constructor(
    private patientService: PatientService,
    private appointmentService: AppointmentService,

  ) {}

  ngOnInit(): void {
    this.getPatientAppointments();
  }

  sortAppointments(): void {
    this.appointments.sort((a, b) => {
      const dateA = new Date(a.date + ' ' + a.time);
      const dateB = new Date(b.date + ' ' + b.time);
      return dateA.getTime() - dateB.getTime();
    });
  }

  getPatientAppointments(): void {
    this.patientService.getPatientProfile().subscribe(
      (patient) => {
        const patientId = patient.id.toString();
        const todayStr = this.todayDate.toISOString().split('T')[0];
        this.appointmentService
          .getPatientAppointments(patientId, this.pageIndex, this.pageSize)
          .subscribe(
            (response: ResponseModel<Appointment>) => {
              this.appointments = response.items.filter((appointment) => {
                const appointmentDate = new Date(appointment.date);
                const appointmentDateStr = appointmentDate.toISOString().split('T')[0];
                return appointmentDateStr === todayStr;
            });
            this.sortAppointments();
            }
          );
      }
    );
  }

}

