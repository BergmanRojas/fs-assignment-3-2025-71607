import { Component } from '@angular/core';
import { ResponseReport } from '../../../../reports/models/responseReport';
import { ReportService } from '../../../../reports/services/report.service';
import { Router } from '@angular/router';
import { AdminSidebarComponent } from '../sidebar/adminSidebar.component';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { PaginationComponent } from '../../../../../core/paging/components/pagination/pagination.component';
import { FormsModule } from '@angular/forms';
import { FilterReportIdentityPipe } from '../../../../pipe/filter-report-identity.pipe';
import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TokenComponent } from '../../../../../shared/components/token/token.component';

@Component({
  selector: 'app-admin-list-report',
  standalone: true,
  templateUrl: './admin-list-report.component.html',
  styleUrl: './admin-list-report.component.scss',
  imports: [
    AdminSidebarComponent,
    CommonModule,
    PaginationComponent,
    FormsModule,
    FilterReportIdentityPipe,
    TokenComponent
  ],
})
export class AdminListReportComponent {
  reports: ResponseReport[] = [];
  pageIndex: number = 0;
  pageSize: number = 100;
  totalPages: number = 0;
  hasNext: boolean = false;
  filterText: string = '';
  constructor(
    private reportService: ReportService,
    private router: Router,
    private toastrService: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getListReports();
  }

  onPageChanged(newPageIndex: number) {
    this.pageIndex = newPageIndex;
    this.getListReports();
  }

  getListReports() {
    this.reportService
      .getList(this.pageIndex, this.pageSize)
      .subscribe((response) => {
        this.reports = response.items.sort(
          (a, b) =>
            new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime()
        );
        this.totalPages = response.pages;
        this.hasNext = response.hasNext;
      });
  }

  goToReport(reportId: number) {
    this.router.navigate(['admin-report-detail', reportId]);
  }

  delete(reportId: number) {
    this.reportService.deleteReport(reportId).subscribe(
      (response) => {
        this.toastrService.success('Rapor silindi');
        this.getListReports();
        this.router.navigate(['admin-reports']);
      }
    );
  }

  confirmDelete(reportId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'ONAY',
        message: 'Bu raporu silmek istediğinizden emin misiniz?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.delete(reportId);
      }
    });
  }
}
