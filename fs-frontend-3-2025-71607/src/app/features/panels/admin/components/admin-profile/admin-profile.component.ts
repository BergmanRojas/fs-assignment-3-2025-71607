import { Component } from '@angular/core';
import { AdminSidebarComponent } from '../sidebar/adminSidebar.component';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Admin } from '../../models/admin';
import { TokenComponent } from '../../../../../shared/components/token/token.component';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [AdminSidebarComponent, CommonModule, ReactiveFormsModule,TokenComponent],
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.scss',
})
export class AdminProfileComponent {
  adminForm: FormGroup;
  admin: Admin;

  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private toastrService: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getAdminProfile();
  }

  initForm() {
    this.adminForm = this.formBuilder.group({
      id: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      nationalIdentity: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
    });
  }

  getAdminProfile() {
    this.adminService.getAdminByAuth().subscribe(
      (data) => {
        this.admin = data;
        this.adminForm.patchValue(data);
      }
    );
  }
  updateAdmin() {
    if (this.adminForm.valid) {
      const updatedAdmin: Admin = this.adminForm.value;
      this.adminService.updateAdmin(updatedAdmin).subscribe(
        (response) => {
          this.toastrService.success('Bilgileriniz başarıyla güncellendi');
          this.router.navigate(['/admin-sidebar']);
        }
      );
    } else {
      this.toastrService.error('Lütfen eksik alanları doldurun');
    }
  }
}
