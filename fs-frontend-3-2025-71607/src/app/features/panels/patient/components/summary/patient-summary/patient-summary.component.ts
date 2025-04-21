import { Component } from '@angular/core';
import { PatientSidebarComponent } from '../../sidebar/psidebar.component';
import { PatientTodayAppointmentComponent } from '../patient-today-appointment/patient-today-appointment.component';
import { FutureAppointmentComponent } from '../future-appointment/future-appointment.component';
import { PatientReportsComponent } from '../patient-reports/patient-reports.component';

import { TokenComponent } from '../../../../../../shared/components/token/token.component';

@Component({
  selector: 'app-patient-summary',
  standalone: true,
  templateUrl: './patient-summary.component.html',
  styleUrl: './patient-summary.component.scss',
  imports: [
    PatientSidebarComponent,
    PatientTodayAppointmentComponent,
    FutureAppointmentComponent,
    PatientReportsComponent,

    TokenComponent,
  ],
})
export class PatientSummaryComponent {}
