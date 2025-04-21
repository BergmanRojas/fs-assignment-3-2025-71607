import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BasicLayoutComponent } from '../../../shared/components/basic-layout/basic-layout.component';
import { User } from '../../../core/auth/models/user-model';
import { AuthService } from '../../../core/auth/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BasicLayoutComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent implements OnInit {
  passwordForm: FormGroup;
  user: User;

  constructor(
    private FormBuilder: FormBuilder,
    private authService: AuthService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.passwordForm = this.FormBuilder.group({
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]+$'),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\\d!@#$%^&*(),.?":{}|<>]{8,15}$'
        ),
      ]),
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.passwordForm.get(field);
    return control
      ? control.invalid && (control.dirty || control.touched)
      : false;
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  ChangePassword() {
    if (this.passwordForm.valid) {
      const ChangePassword: User = this.passwordForm.value;
      this.authService.ChangePassword(ChangePassword).subscribe(
        (response) => {
          this.toastrService.success('Şifre başarıyla güncellendi');
          this.router.navigate(['/login']);
        }
      );
    } else {
      this.toastrService.error('Lütfen eksik alanları doldurun');
    }
  }
}
