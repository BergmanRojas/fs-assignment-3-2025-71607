import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AdminSidebarComponent } from '../sidebar/adminSidebar.component';

import { Patient } from '../../../patient/models/patientModel';
import { RouterModule } from '@angular/router';
import { CapitalizeFirstPipe } from '../../../../pipe/capitalize-first.pipe';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PaginationComponent } from '../../../../../core/paging/components/pagination/pagination.component';
import { FormsModule } from '@angular/forms';
import { FilterPatientIdentityPipe } from '../../../../pipe/filter-patient-identity.pipe';
import { TokenComponent } from '../../../../../shared/components/token/token.component';
import { ToastrService } from 'ngx-toastr';
import { PatientService } from '../../../patient/services/patient.service';

@Component({
  selector: 'app-list-patient',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AdminSidebarComponent,
    CapitalizeFirstPipe,
    PaginationComponent,
    FormsModule,
    FilterPatientIdentityPipe,
    TokenComponent,
  ],
  templateUrl: './list-Patient.component.html',
  styleUrl: './list-Patient.component.scss',
})
export class ListPatientComponent implements OnInit {
  patients: Patient[] = [];
  pageIndex: number = 0;
  pageSize: number = 5;
  totalPages: number = 0;
  hasNext: boolean = false;
  filterText: string = '';

  constructor(
    private patientService: PatientService,
    private toastrService: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getPatients();
  }

  onPageChanged(newPageIndex: number) {
    this.pageIndex = newPageIndex;
    this.getPatients();
  }

  getPatients() {
    this.patientService
      .getPatients(this.pageIndex, this.pageSize)
      .subscribe((response) => {
        this.patients = response.items;
        this.patients.sort((a, b) => a.firstName.localeCompare(b.firstName));
        this.totalPages = response.pages;
        this.hasNext = response.hasNext;
      });
  }

  confirmDelete(patientId: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'ONAY',
        message: 'Bu hastayı silmek istediğinizden emin misiniz?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deletePatient(patientId);
      }
    });
  }

  deletePatient(patientId: string) {
    this.patientService.deletePatient(patientId).subscribe(
      (response) => {
        this.toastrService.success('Hasta başarıyla silindi');
        this.getPatients();
      }
    );
  }
}
