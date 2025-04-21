import { Component } from '@angular/core';
import { TodayAppointmentComponent } from '../today-appointment/today-appointment.component';
import { TomorrowAppointmentComponent } from '../tomorrow-appointment/tomorrow-appointment.component';

import { ReportsComponent } from '../reports/reports.component';
import { DoctorSidebarComponent } from '../../sidebar/doctorSidebar.component';
import { TokenComponent } from '../../../../../../shared/components/token/token.component';

@Component({
  selector: 'app-summary',
  standalone: true,
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
  imports: [
    TodayAppointmentComponent,
    TomorrowAppointmentComponent,

    ReportsComponent,
    DoctorSidebarComponent,
    TokenComponent
  ],
})
export class SummaryComponent {}
