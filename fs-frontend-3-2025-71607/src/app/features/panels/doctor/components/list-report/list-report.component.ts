import { Component, OnInit } from '@angular/core';
import { DoctorSidebarComponent } from '../sidebar/doctorSidebar.component';
import { ResponseReport } from '../../../../reports/models/responseReport';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../../../reports/services/report.service';
import { TokenService } from '../../../../../core/auth/services/token.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FilterReportIdentityPipe } from '../../../../pipe/filter-report-identity.pipe';
import { TokenComponent } from '../../../../../shared/components/token/token.component';

@Component({
  selector: 'app-list-report',
  standalone: true,
  templateUrl: './list-report.component.html',
  styleUrl: './list-report.component.scss',
  imports: [
    DoctorSidebarComponent,
    CommonModule,
    FormsModule,
    FilterReportIdentityPipe,
    TokenComponent,
  ],
})
export class ListReportComponent implements OnInit {
  reports: ResponseReport[] = [];
  pageIndex: number = 0;
  pageSize: number = 100;
  filterText: string = '';

  constructor(
    private reportService: ReportService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getDoctorReports();
  }

  sortReportsByDateDescending(): void {
    this.reports.sort((a, b) => {
      const dateA = new Date(a.appointmentDate);
      const dateB = new Date(b.appointmentDate);
      return dateB.getTime() - dateA.getTime(); // Azalan sırayla sıralama
    });
  }

  getDoctorReports() {
    let doctorId = this.tokenService.getUserId().toString();
    this.reportService
      .getDoctorReports(this.pageIndex, this.pageSize, doctorId)
      .subscribe((response) => {
        this.reports = response.items;
        this.sortReportsByDateDescending();
      });
  }

  goToReport(reportId: number) {
    this.router.navigate(['report-detail', reportId]);
  }
}
