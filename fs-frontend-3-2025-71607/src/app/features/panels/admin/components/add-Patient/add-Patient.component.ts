import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AdminSidebarComponent } from '../sidebar/adminSidebar.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Patient } from '../../../patient/models/patientModel';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TokenComponent } from '../../../../../shared/components/token/token.component';
import { PatientService } from '../../../patient/services/patient.service';

@Component({
  selector: 'app-add-patient',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminSidebarComponent,
    TokenComponent
  ],
  templateUrl: './add-Patient.component.html',
  styleUrl: './add-Patient.component.scss',
})
export class AddPatientComponent {
  patients: Patient[] = [];
  pageIndex: number = 0;
  pageSize: number = 50;
  patientForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private patientService: PatientService,
    private toastrService: ToastrService,
    private router: Router
  ) {
    this.patientForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: [''],
      age: [''],
      height: [''],
      weight: [''],
      bloodGroup: [''],
      nationalIdentity: [''],
      phone: ['', Validators.required],
      address: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.patientService.getPatients(this.pageIndex, this.pageSize).subscribe((response) => {
      this.patients = response.items;
    });
  }

  addPatient(): void {
    if (this.patientForm.valid) {
      this.patientService.addPatient(this.patientForm.value).subscribe(() => {
        this.toastrService.success('Patient successfully added');
        this.router.navigate(['/admin-patient']);
      });
    } else {
      this.toastrService.error('Please fill in all required fields.');
    }
  }







}
