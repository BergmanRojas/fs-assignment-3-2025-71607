import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { AppointmentService } from '../../../../../appointments/services/appointment.service';
import { Appointment } from '../../../../../appointments/models/appointmentModel';
import { ResponseModel } from '../../../../../models/responseModel';
import { PatientService } from '../../../services/patient.service';

@Component({
  selector: 'app-future-appointment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './future-appointment.component.html',
  styleUrl: './future-appointment.component.scss',
})
export class FutureAppointmentComponent {
  appointments: Appointment[] = [];
  pageIndex: number = 0;
  pageSize: number = 100;
  todayDate: Date = new Date();

  constructor(
    private patientService: PatientService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this.getPatientAppointments();
  }

  sortAppointments(): void {
    this.appointments.sort((a, b) => {
      const dateA = new Date(a.date + ' ' + a.time);
      const dateB = new Date(b.date + ' ' + b.time);
      return dateA.getTime() - dateB.getTime(); // Artan sırayla sıralama
    });
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
                  appointmentDate > this.todayDate ||
                  (appointmentDate.getTime() === this.todayDate.getTime() &&
                    appointment.time >=
                      this.todayDate.toTimeString().slice(0, 5))
                );
              });
              this.sortAppointments();
            }
          );
      }
    );
  }
}
