import { Component, OnInit } from '@angular/core';
import { DoctorSidebarComponent } from '../sidebar/doctorSidebar.component';
import { Doctor } from '../../models/doctor';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TokenComponent } from '../../../../../shared/components/token/token.component';
import { DoctorService } from '../../services/doctor.service';

@Component({
  selector: 'app-doctor-profile',
  standalone: true,
  imports: [
    CommonModule,
    DoctorSidebarComponent,
    FormsModule,
    ReactiveFormsModule,
    TokenComponent,
  ],
  templateUrl: './doctor-profile.component.html',
  styleUrls: ['./doctor-profile.component.scss'],
})
export class DoctorProfileComponent implements OnInit {
  doctorForm: FormGroup;
  doctor: Doctor;

  constructor(
    private formBuilder: FormBuilder,
    private doctorService: DoctorService,
    private toastrService: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getDoctorProfile();
  }

  initForm() {
    this.doctorForm = this.formBuilder.group({
      id: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      title: ['', Validators.required],
      schoolName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      nationalIdentity: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      email: [
        { value: '', disabled: true },
        [Validators.required, Validators.email],
      ],
    });
  }

  getDoctorProfile() {
    this.doctorService.getDoctorProfile().subscribe((data) => {
      this.doctor = data;
      this.doctorForm.patchValue(data);
    });
  }

  updateDoctor() {
    if (this.doctorForm.valid) {
      const updatedDoctor: Doctor = this.doctorForm.getRawValue();
      updatedDoctor.id = this.doctor.id;
      this.doctorService.updateDoctor(updatedDoctor).subscribe(
        () => {
          this.toastrService.success('Your information has been successfully updated');
          this.router.navigate(['doctor-sidebar']);
        },
        (error) => {
          this.toastrService.error('An error occurred during update');
        }
      );
    } else {
      this.toastrService.error('Please fill in all required fields');
    }
  }
}
