import { Component } from '@angular/core';
import { ResponseReport } from '../../../../reports/models/responseReport';
import { ReportService } from '../../../../reports/services/report.service';
import { TokenService } from '../../../../../core/auth/services/token.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PatientSidebarComponent } from '../sidebar/psidebar.component';
import { TokenComponent } from '../../../../../shared/components/token/token.component';

@Component({
  selector: 'app-patient-list-report',
  standalone: true,
  imports: [
    CommonModule,
    PatientSidebarComponent,
    RouterModule,
    TokenComponent,
  ],
  templateUrl: './patient-list-report.component.html',
  styleUrl: './patient-list-report.component.scss',
})
export class PatientListReportComponent {
  reports: ResponseReport[] = [];
  pageIndex: number = 0;
  pageSize: number = 10;

  constructor(
    private reportService: ReportService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getPatientReports();
  }

  sortReportsByDateDescending(): void {
    this.reports.sort((a, b) => {
      const dateA = new Date(a.reportDate);
      const dateB = new Date(b.reportDate);
      return dateB.getTime() - dateA.getTime();
    });
  }

  getPatientReports() {
    const patientId = this.tokenService.getUserId().toString();
    this.reportService
      .getPatientReports(this.pageIndex, this.pageSize, patientId)
      .subscribe((response) => {
        this.reports = response.items;
        this.sortReportsByDateDescending();
      });
  }
}
