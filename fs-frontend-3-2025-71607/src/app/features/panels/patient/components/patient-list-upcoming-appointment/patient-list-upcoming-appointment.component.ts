import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PatientSidebarComponent } from '../sidebar/psidebar.component';
import { Appointment } from '../../../../appointments/models/appointmentModel';

import { AppointmentService } from '../../../../appointments/services/appointment.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ResponseModel } from '../../../../models/responseModel';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { TokenComponent } from '../../../../../shared/components/token/token.component';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-patient-list-upcoming-appointment',
  standalone: true,
  imports: [CommonModule, PatientSidebarComponent, TokenComponent],
  templateUrl: './patient-list-upcoming-appointment.component.html',
  styleUrl: './patient-list-upcoming-appointment.component.scss',
})
export class PatientListUpcomingAppointmentComponent {
  appointments: Appointment[] = [];
  pageIndex: number = 0;
  pageSize: number = 12;
  todayDate: Date = new Date();

  constructor(
    private patientService: PatientService,
    private appointmentService: AppointmentService,
    private toastrService: ToastrService,
    private router: Router,
    private dialog: MatDialog
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

  viewReport(): void {
    this.toastrService.error(
      'Bu randevu henüz gerçekleşmedi!',
      'Rapor bulunamadı'
    );
  }

  confirmDelete(appointmentId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'ONAY',
        message: 'Bu randevuyu iptal etmek istediğinizden emin misiniz?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteAppointment(appointmentId);
      }
    });
  }

  deleteAppointment(appointmentId: number) {
    this.appointmentService.deleteAppointment(appointmentId).subscribe(
      (response) => {
        this.toastrService.success('Randevu başarıyla iptal edildi!');
        this.getPatientAppointments();
      }
    );
  }
}
