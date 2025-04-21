import { Component } from '@angular/core';
import { Appointment } from '../../../../appointments/models/appointmentModel';
import { AppointmentService } from '../../../../appointments/services/appointment.service';
import { ResponseModel } from '../../../../models/responseModel';
import { DoctorSidebarComponent } from '../sidebar/doctorSidebar.component';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FilterAppointmentIdentityPipe } from '../../../../pipe/filter-appointment-identity.pipe';
import { TokenComponent } from '../../../../../shared/components/token/token.component';
import { DoctorService } from '../../services/doctor.service';

@Component({
  selector: 'app-pending-appointment',
  standalone: true,
  imports: [
    CommonModule,
    DoctorSidebarComponent,
    FormsModule,
    FilterAppointmentIdentityPipe,
    TokenComponent,
  ],
  templateUrl: './pending-appointment.component.html',
  styleUrl: './pending-appointment.component.scss',
})
export class PendingAppointmentComponent {
  appointments: Appointment[] = [];
  pageIndex: number = 0;
  pageSize: number = 12;
  todayDate: Date = new Date();
  filterText: string = '';

  constructor(
    private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private toastrService: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDoctorAppointments();
  }

  sortAppointments(): void {
    this.appointments.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateA.getTime() - dateB.getTime(); // Sort ascending by date and time
    });
  }

  loadDoctorAppointments(): void {
    this.doctorService.getDoctorProfile().subscribe((doctor) => {
      const doctorId = doctor.id.toString();
      this.appointmentService
        .getDoctorAppointments(doctorId, this.pageIndex, this.pageSize)
        .subscribe((response: ResponseModel<Appointment>) => {
          this.appointments = response.items.filter((appointment) => {
            const appointmentDate = new Date(appointment.date);
            return (
              appointmentDate > this.todayDate ||
              (appointmentDate.getTime() === this.todayDate.getTime() &&
                appointment.time > this.todayDate.toTimeString().slice(0, 5))
            );
          });
          this.sortAppointments();
        });
    });
  }

  public viewReport(): void {
    this.toastrService.error(
      'The appointment has not yet taken place. No report is available.',
      'Notice'
    );
  }
}
