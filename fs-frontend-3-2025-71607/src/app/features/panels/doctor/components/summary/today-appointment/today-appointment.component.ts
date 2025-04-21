import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../../../../../core/auth/services/token.service';
import { AppointmentService } from '../../../../../appointments/services/appointment.service';
import { Appointment } from '../../../../../appointments/models/appointmentModel';
import { DoctorSidebarComponent } from '../../sidebar/doctorSidebar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterAppointmentIdentityPipe } from '../../../../../pipe/filter-appointment-identity.pipe';

@Component({
  selector: 'app-today-appointment',
  standalone: true,
  templateUrl: './today-appointment.component.html',
  styleUrls: ['./today-appointment.component.scss'],
  imports: [
    DoctorSidebarComponent,
    CommonModule,
    FormsModule,
    FilterAppointmentIdentityPipe,
  ],
})
export class TodayAppointmentComponent implements OnInit {
  pageIndex: number = 0;
  pageSize: number = 100;
  appointments: Appointment[] = [];
  todayDate: Date = new Date();
  filterText: string = '';

  constructor(
    private tokenService: TokenService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this.loadTodayAppointments();
  }

  loadTodayAppointments(): void {
    const doctorId: string = this.tokenService.getUserId();
    const todayStr = this.todayDate.toISOString().split('T')[0];
    this.appointmentService
      .getDoctorAppointments(doctorId, this.pageIndex, this.pageSize)
      .subscribe((response) => {
        this.appointments = response.items.filter((appointment) => {
          const appointmentDate = new Date(appointment.date);
          const appointmentDateStr = appointmentDate
            .toISOString()
            .split('T')[0];
          return appointmentDateStr === todayStr;
        });
      });
  }
}
