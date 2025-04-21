import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../../../../appointments/services/appointment.service';

import { Appointment } from '../../../../../appointments/models/appointmentModel';
import { ResponseModel } from '../../../../../models/responseModel';
import { AdminSidebarComponent } from '../../sidebar/adminSidebar.component';

import { Router, RouterModule } from '@angular/router';
import { ReportService } from '../../../../../reports/services/report.service';
import { ToastrService } from 'ngx-toastr';
import { PaginationComponent } from '../../../../../../core/paging/components/pagination/pagination.component';
import { FormsModule } from '@angular/forms';
import { FilterAppointmentIdentityPipe } from '../../../../../pipe/filter-appointment-identity.pipe';
import { TokenComponent } from '../../../../../../shared/components/token/token.component';
import { DoctorService } from '../../../../doctor/services/doctor.service';

@Component({
  selector: 'app-past-appointments',
  standalone: true,
  imports: [
    CommonModule,
    AdminSidebarComponent,
    RouterModule,
    PaginationComponent,
    FilterAppointmentIdentityPipe,
    FormsModule,
    TokenComponent
  ],
  templateUrl: './past-appointments.component.html',
  styleUrls: ['./past-appointments.component.scss'],
})
export class PastAppointmentsComponent implements OnInit {
  pastAppointments: Appointment[] = [];
  todayDate: Date = new Date();
  errorMessage: string;
  hasReportMap: { [key: number]: boolean } = {};
  pageIndex: number = 0;
  pageSize: number = 100;
  totalPages: number = 0;
  hasNext: boolean = false;
  filterText: string = '';

  constructor(
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private reportService: ReportService,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadPastAppointments();
  }
  onPageChanged(newPageIndex: number) {
    this.pageIndex = newPageIndex;
    this.loadPastAppointments();
  }
  loadPastAppointments(): void {
    this.appointmentService
      .getAllAppointments(this.pageIndex, this.pageSize)
      .subscribe(
        (response: ResponseModel<Appointment>) => {
          this.totalPages = response.pages;
          this.hasNext = response.hasNext;
          this.pastAppointments = response.items.filter((appointment) => {
            const appointmentDate = new Date(appointment.date);
            return (
              appointmentDate < this.todayDate ||
              (appointmentDate.getTime() === this.todayDate.getTime() &&
                appointment.time < this.todayDate.toTimeString().slice(0, 5))
            );
          });
          const appointmentObservables = this.pastAppointments.map(
            (appointment) => {
              return this.reportService
                .getByAppointmentId(appointment.id)
                .toPromise()
                .then(
                  (response) => {
                    this.hasReportMap[appointment.id] = true;
                  },
                  (error) => {
                    this.hasReportMap[appointment.id] = false;
                  }
                );
            }
          );
          Promise.all(appointmentObservables).then(() => {
            this.pastAppointments = this.pastAppointments;
          });
        }
      );
  }

  confirmDelete(appointmentId: number): void {
    if (confirm('Randevuyu silmek istediğinize emin misiniz?')) {
      this.deleteAppointment(appointmentId);
    }
  }

  deleteAppointment(appointmentId: number): void {
    this.appointmentService.deleteAppointment(appointmentId).subscribe(
      () => {
        this.pastAppointments = this.pastAppointments.filter(
          (appointment) => appointment.id !== appointmentId
        );
      }
    );
  }

  public viewReport(appointmentId: number) {
    if (this.hasReportMap[appointmentId]) {
      this.reportService
        .getByAppointmentId(appointmentId)
        .subscribe((response) => {
          let reportId = response.id;
          this.router.navigate(['admin-report-detail', reportId]);
        });
    } else {
      this.toastrService.warning('Rapor bulunmamaktadır.');
    }
  }

  public addReport(appointmentId: number) {
    if (this.hasReportMap[appointmentId]) {
      this.toastrService.warning('Zaten bir raporunuz var');
    } else {
      this.router.navigate(['/admin-add-report', appointmentId]);
    }
  }
}
