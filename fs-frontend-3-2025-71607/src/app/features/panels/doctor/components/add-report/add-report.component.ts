import { Component, OnInit } from '@angular/core';
import { DoctorSidebarComponent } from '../sidebar/doctorSidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { AddReport } from '../../../../reports/models/addReport';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from '../../../../reports/services/report.service';
import { TokenComponent } from '../../../../../shared/components/token/token.component';

@Component({
  selector: 'app-add-report',
  standalone: true,
  templateUrl: './add-report.component.html',
  styleUrl: './add-report.component.scss',
  imports: [
    DoctorSidebarComponent,
    FormsModule,
    ReactiveFormsModule,
    TokenComponent,
  ],
})
export class AddReportComponent implements OnInit {
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
          this.router.navigate(['/doctor-reports']);
        }
      );
    } else {
      this.toastrService.error('Lütfen eksik alanları doldurun');
    }
  }
}
