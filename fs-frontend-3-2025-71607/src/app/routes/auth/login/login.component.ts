import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../core/auth/services/auth.service';
import { Router } from '@angular/router'; // Router modülünü ekliyoruz
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LoginModel } from '../../../core/auth/models/loginModel';
import { BasicLayoutComponent } from '../../../shared/components/basic-layout/basic-layout.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { TokenService } from '../../../core/auth/services/token.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ScrollService } from '../../../shared/components/footer-content/scroll-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    BasicLayoutComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router,
    private tokenService:TokenService,
    private scrollService: ScrollService
  ) {}

  ngOnInit(): void {
    this.createLoginForm();
  }

  createLoginForm() {
    this.loginForm = this.formBuilder.group({

      email:new FormControl ('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8),Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\\d!@#$%^&*(),.?":{}|<>]{8,15}$')]),



    });
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  login() {
    if (this.loginForm.valid) {
      const loginModel: LoginModel = Object.assign({}, this.loginForm.value);
      this.authService.login(loginModel).subscribe(
        (response) => {
          const token = response.accessToken.token;
          localStorage.setItem('token', token);
          this.toastrService.success('Giriş başarılı!', 'Başarılı');

          const userRoles=this.tokenService.getUserRole();

          if(userRoles=="Admin")
          this.router.navigate(['admin-charts']);
           else if(userRoles.includes("Doctors.Update"))
          this.router.navigate(['doctor-summary'])
          else if(userRoles.includes("Patients.Update"))
            this.router.navigate(['patient-summary'])
        }
      );
    } else {
      this.toastrService.error('Form geçerli değil. Lütfen bilgilerinizi kontrol edin.', 'Uyarı');
    }
  }
}
