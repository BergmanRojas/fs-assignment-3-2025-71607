import { Component } from '@angular/core';
import { AppointmentChartComponent } from '../appointment-chart/appointment-chart.component';
import { PaiChartTitleComponent } from '../pai-chart-title/pai-chart-title.component';
import { TotalNumberCardsComponent } from '../total-number-cards/total-number-cards.component';
import { AdminSidebarComponent } from '../../sidebar/adminSidebar.component';
import { TokenComponent } from '../../../../../../shared/components/token/token.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [
    AppointmentChartComponent,
    PaiChartTitleComponent,
    TotalNumberCardsComponent,
    AdminSidebarComponent,
    TokenComponent
  ],
})
export class DashboardComponent {}
