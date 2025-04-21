import { Component } from '@angular/core';
import { BasicLayoutComponent } from '../../../shared/components/basic-layout/basic-layout.component';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { RegisterModel } from '../../../core/auth/models/registerModel';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [BasicLayoutComponent,ReactiveFormsModule,CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.formBuilder.group({
      firstName: new FormControl('',[ Validators.required, Validators.minLength(2), Validators.maxLength(30), Validators.pattern('^[a-zA-ZçÇğĞıİöÖşŞüÜ]+$')]),
      lastName: new FormControl ('', [Validators.required, Validators.minLength(2), Validators.maxLength(30),  Validators.pattern('^[a-zA-ZçÇğĞıİöÖşŞüÜ]+$')]),
      phone: new FormControl ('',[Validators.required,Validators.pattern('^[0-9]+$')]),
      email:new FormControl ('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8),Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\\d!@#$%^&*(),.?":{}|<>]{8,15}$')]),

    });
  }
  isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }


  register() {
  if (this.registerForm.valid) {
    let registerModel = Object.assign({}, this.registerForm.value);
    this.authService.register(registerModel).subscribe(
      (response) => {
        this.toastrService.warning("Mail hesabınızı doğrulamanız gerekmektedir", "Kayıt olundu", {
          progressBar: true
        });
        this.router.navigate(['/']);
      }
    );
  }else {
    this.toastrService.error('Eksik bilgi girdiniz. Lütfen bilgilerinizi kontrol edin.', 'Uyarı');
  }
}





}
