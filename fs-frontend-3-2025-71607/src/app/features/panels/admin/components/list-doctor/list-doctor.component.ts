import { Component, OnInit } from '@angular/core';
import { AdminSidebarComponent } from '../sidebar/adminSidebar.component';
import { CommonModule } from '@angular/common';
import { Doctor } from '../../../doctor/models/doctor';
import { Router, RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CapitalizeFirstPipe } from '../../../../pipe/capitalize-first.pipe';
import { FormsModule } from '@angular/forms';
import { FilterDoctorNamePipe } from '../../../../pipe/filter-doctor-name.pipe';
import { PaginationComponent } from '../../../../../core/paging/components/pagination/pagination.component';
import { TokenComponent } from '../../../../../shared/components/token/token.component';
import { ToastrService } from 'ngx-toastr';
import { DoctorService } from '../../../doctor/services/doctor.service';

@Component({
  selector: 'app-list-doctor',
  standalone: true,
  imports: [
    AdminSidebarComponent,
    CommonModule,
    RouterModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    CapitalizeFirstPipe,
    FilterDoctorNamePipe,
    PaginationComponent,
    TokenComponent,
  ],
  templateUrl: './list-doctor.component.html',
  styleUrl: './list-doctor.component.scss',
})
export class ListDoctorComponent implements OnInit {
  doctors: Doctor[] = [];
  pageIndex: number = 0;
  pageSize: number = 5;
  totalPages: number = 0;
  hasNext: boolean = false;
  filterText: string = '';

  constructor(
    private doctorService: DoctorService,
    private dialog: MatDialog,
    private toastrService: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getDoctors();
  }

  onPageChanged(newPageIndex: number): void {
    this.pageIndex = newPageIndex;
    this.getDoctors();
  }

  getDoctors(): void {
    this.doctorService
      .getDoctors(this.pageIndex, this.pageSize)
      .subscribe((response) => {
        this.doctors = response.items.sort((a, b) => a.firstName.localeCompare(b.firstName));
        this.totalPages = response.pages;
        this.hasNext = response.hasNext;
      });
  }

  confirmDelete(doctorId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'CONFIRMATION',
        message: 'Are you sure you want to delete this doctor?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteDoctor(doctorId);
      }
    });
  }

  deleteDoctor(doctorId: string): void {
    this.doctorService.deleteDoctor(doctorId).subscribe(() => {
      this.toastrService.success('Doctor deleted successfully.');
      this.getDoctors();
    });
  }

  goToDoctorDetails(doctorId: string): void {
    this.router.navigate(['admin-doctor-details', doctorId]);
  }
}

