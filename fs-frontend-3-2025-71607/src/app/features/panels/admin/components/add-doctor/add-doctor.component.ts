import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AdminSidebarComponent } from '../sidebar/adminSidebar.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TokenComponent } from '../../../../../shared/components/token/token.component';
import { DoctorService } from '../../../doctor/services/doctor.service';

@Component({
  selector: 'app-add-doctor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminSidebarComponent,
    TokenComponent,
  ],
  templateUrl: './add-doctor.component.html',
  styleUrls: ['./add-doctor.component.scss'],
})
export class AddDoctorComponent implements OnInit {
  doctorForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private doctorService: DoctorService,
    private toastrService: ToastrService,
    private router: Router
  ) {
    this.doctorForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      title: ['', Validators.required],
      schoolName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      nationalIdentity: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  addDoctor(): void {
    if (this.doctorForm.valid) {
      const doctorData = this.doctorForm.value;

      this.doctorService.addDoctor(doctorData).subscribe(
        () => {
          this.toastrService.success('Doctor added successfully');
          this.router.navigate(['/admin-list-doctor']);
        },
        (error) => {
          this.toastrService.error('An error occurred while adding the doctor');
        }
      );
    } else {
      this.toastrService.error('Please fill in all required fields.');
    }
  }
}
