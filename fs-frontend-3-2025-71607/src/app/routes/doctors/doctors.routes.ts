import { Routes } from '@angular/router';
import { DoctorSidebarComponent } from '../../features/panels/doctor/components/sidebar/doctorSidebar.component';
import { DoctorProfileComponent } from '../../features/panels/doctor/components/doctor-profile/doctor-profile.component';
import { AppointmentHistoryComponent } from '../../features/panels/doctor/components/appointment-history/appointment-history.component';
import { PendingAppointmentComponent } from '../../features/panels/doctor/components/pending-appointment/pending-appointment.component';
import { ListReportComponent } from '../../features/panels/doctor/components/list-report/list-report.component';
import { EditReportComponent } from '../../features/panels/doctor/components/edit-report/edit-report.component';
import { AddReportComponent } from '../../features/panels/doctor/components/add-report/add-report.component';
import { SummaryComponent } from '../../features/panels/doctor/components/summary/summary/summary.component';
import { DoctorSidebarPatientComponent } from '../../features/panels/doctor/components/doctorSidebar-Patient/doctorSidebar-Patient.component';

export const doctorRoutes: Routes = [
  {
    path: 'doctor-sidebar',
    component: DoctorSidebarComponent,
  },
  {
    path: 'doctor-profile',
    component: DoctorProfileComponent,
  },
  {
    path: 'appointment-history',
    component: AppointmentHistoryComponent,
  },
  {
    path: 'pending-appointments',
    component: PendingAppointmentComponent,
  },
  {
    path: 'doctor-reports',
    component: ListReportComponent,
  },
  {
    path: 'report-detail/:id',
    component: EditReportComponent,
  },
  {
    path: 'add-report/:appointmentId',
    component: AddReportComponent,
  },
  {
    path: 'doctor-summary',
    component: SummaryComponent,
  },
  {
    path: 'doctor-patient',
    component: DoctorSidebarPatientComponent,
  }
];
