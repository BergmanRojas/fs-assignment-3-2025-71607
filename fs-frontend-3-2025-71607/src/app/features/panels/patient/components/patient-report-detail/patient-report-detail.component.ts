import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PatientSidebarComponent } from '../sidebar/psidebar.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ResponseReport } from '../../../../reports/models/responseReport';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReportService } from '../../../../reports/services/report.service';
import { TokenComponent } from '../../../../../shared/components/token/token.component';

@Component({
  selector: 'app-patient-report-detail',
  standalone: true,
  imports: [
    CommonModule,
    PatientSidebarComponent,
    ReactiveFormsModule,
    RouterModule,
    TokenComponent,
  ],
  templateUrl: './patient-report-detail.component.html',
  styleUrl: './patient-report-detail.component.scss',
})
export class PatientReportDetailComponent {
  reportForm: FormGroup;
  responseReport: ResponseReport;
  reportId: number;

  constructor(
    private formsBuilder: FormBuilder,
    private reportService: ReportService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        this.reportId = +params['id'];
        this.getReport(this.reportId);
      }
    });
    this.createReportForm();
  }

  createReportForm() {
    this.reportForm = this.formsBuilder.group({
      name: ['', Validators.required],
      tcNo: ['', Validators.required],
      reportText: ['', Validators.required],
    });
  }

  getReport(id: number) {
    this.reportService.getReportDetails(id).subscribe((response) => {
      this.responseReport = response;
      this.reportForm.patchValue({
        name: response.patientFirstName + ' ' + response.patientLastName,
        tcNo: response.patientIdentity,
        reportText: response.text,
      });
    });
  }
}
