import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DoctorSidebarComponent } from '../sidebar/doctorSidebar.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from '../../../../reports/services/report.service';
import { ResponseReport } from '../../../../reports/models/responseReport';
import { UpdateRequestReport } from '../../../../reports/models/update-request-report';
import { TokenComponent } from '../../../../../shared/components/token/token.component';

@Component({
  selector: 'app-edit-report',
  standalone: true,
  templateUrl: './edit-report.component.html',
  styleUrl: './edit-report.component.scss',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DoctorSidebarComponent,
    RouterModule,
    TokenComponent,
  ],
})
export class EditReportComponent implements OnInit {
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
      } else {
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

  update() {
    if (this.reportForm.valid) {
      const updatedReport: UpdateRequestReport = {
        id: this.reportId,
        text: this.reportForm.value.reportText,
      };

      this.reportService.updateReport(updatedReport).subscribe(
        (response) => {
          this.toastrService.success('Bilgileriniz başarıyla güncellendi');
          this.router.navigate(['doctor-reports']);
        }
      );
    } else {
      this.toastrService.error('Lütfen eksik alanları doldurun');
    }
  }
}
