import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Patient } from '../../../patient/models/patientModel';

import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminSidebarComponent } from '../sidebar/adminSidebar.component';
import { TokenComponent } from '../../../../../shared/components/token/token.component';
import { PatientService } from '../../../patient/services/patient.service';

@Component({
  selector: 'app-update-patient',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminSidebarComponent,
    TokenComponent,
  ],
  templateUrl: './update-patient.component.html',
  styleUrl: './update-patient.component.scss',
})
export class UpdatePatientComponent {
  patientForm: FormGroup;
  patient: Patient;

  constructor(
    private FormBuilder: FormBuilder,
    private PatientService: PatientService,
    private toastrService: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getPatientProfile();
  }

  initForm() {
    this.patientForm = this.FormBuilder.group({
      id: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      age: ['', Validators.required],
      height: ['', Validators.required],
      weight: ['', Validators.required],
      bloodGroup: ['', Validators.required],
      nationalIdentity: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  getPatientProfile() {
    this.route.paramMap.subscribe((params) => {
      const patientId = params.get('patientId');
      if (patientId) {
        this.PatientService.getByPatientId(patientId, 0, 1).subscribe(
          (data) => {
            this.patient = data;
            this.patientForm.patchValue({
              id: data.id,
              firstName: data.firstName,
              lastName: data.lastName,
              age: data.age,
              height: data.height,
              weight: data.weight,
              bloodGroup: data.bloodGroup,
              dateOfBirth: data.dateOfBirth,
              nationalIdentity: data.nationalIdentity,
              phone: data.phone,
              address: data.address,
              email: data.email,
            });
          }
        );
      }
    });
  }

  updatePatient() {
    if (this.patientForm.valid) {
      const updatedPatient: Patient = this.patientForm.value;
      updatedPatient.id = this.patient.id;
      this.PatientService.updatePatient(updatedPatient).subscribe(
        (response) => {
          this.toastrService.success('Hasta başarıyla güncellendi');
          this.router.navigate(['/admin-patient']);
        }
      );
    } else {
      this.toastrService.error('Lütfen eksik alanları doldurun');
    }
  }
}
