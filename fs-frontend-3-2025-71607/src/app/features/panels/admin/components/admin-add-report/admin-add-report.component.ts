import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from '../../../../reports/services/report.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminSidebarComponent } from '../sidebar/adminSidebar.component';
import { AddReport } from '../../../../reports/models/addReport';
import { TokenComponent } from '../../../../../shared/components/token/token.component';

@Component({
  selector: 'app-admin-add-report',
  standalone: true,
  templateUrl: './admin-add-report.component.html',
  styleUrl: './admin-add-report.component.scss',
  imports: [
    AdminSidebarComponent,
    FormsModule,
    ReactiveFormsModule,
    TokenComponent,
  ],
})
export class AdminAddReportComponent implements OnInit {
  reportForm: FormGroup;
  appointmentId: number;

  constructor(
    private formsBuilder: FormBuilder,
    private toastrService: ToastrService,
    private router: Router,
    private reportService: ReportService,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params['appointmentId']) {
        this.appointmentId = +params['appointmentId'];
      }
    });
    this.createReportForm();
  }

  createReportForm() {
    this.reportForm = this.formsBuilder.group({
      reportText: ['', Validators.required],
    });
  }

  add() {
    if (this.reportForm.valid) {
      const addReport: AddReport = {
        appointmentID: this.appointmentId,
        text: this.reportForm.value.reportText,
      };

      this.reportService.addReport(addReport).subscribe(
        (response) => {
          this.toastrService.success('Rapor eklendi');
          this.router.navigate(['past-appointments']);
        }
      );
    } else {
      this.toastrService.error('Lütfen eksik alanları doldurun');
    }
  }
}
