import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Patient } from '../../models/patientModel';

import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TokenComponent } from '../../../../../shared/components/token/token.component';
import { PatientSidebarComponent } from '../sidebar/psidebar.component';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TokenComponent,
    PatientSidebarComponent
  ],
  templateUrl: './Patient-profile.component.html',
  styleUrls: ['./Patient-profile.component.scss'],
})
export class PatientProfileComponent implements OnInit {
  PatientForm: FormGroup;
  patient: Patient;

  constructor(
    private formBuilder: FormBuilder,
    private patientService: PatientService,
    private toastrService: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getPatientProfile();
  }

  initForm() {
    this.PatientForm = this.formBuilder.group({
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
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
    });
  }

  getPatientProfile() {
    this.patientService.getPatientProfile().subscribe(
      (data) => {
        this.patient = data;
        this.PatientForm.patchValue(data);
      }
    );
  }

  updatePatient() {
    if (this.PatientForm.valid) {
      const updatedPatient: Patient = this.PatientForm.getRawValue();
      updatedPatient.id = this.patient.id;
      this.patientService.updatePatient(updatedPatient).subscribe(
        (response) => {
          this.toastrService.success('Bilgileriniz başarıyla güncellendi');
          this.router.navigate(['patient-sidebar']);
        }
      );
    } else {
      this.toastrService.error('Lütfen eksik alanları doldurun');
    }
  }
}
