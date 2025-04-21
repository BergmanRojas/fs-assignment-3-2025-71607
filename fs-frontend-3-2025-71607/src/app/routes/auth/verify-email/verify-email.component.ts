import { Component } from '@angular/core';
import { BasicLayoutComponent } from '../../../shared/components/basic-layout/basic-layout.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [BasicLayoutComponent],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss'
})
export class VerifyEmailComponent {
  activationKey: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    // Get 'ActivationKey' from URL query parameters
    this.route.queryParams.subscribe(params => {
      this.activationKey = params['ActivationKey'];
    });
  }

  validate() {
    // Call verifyEmail method from AuthService
    this.authService.verifyEmail(this.activationKey)
      .subscribe(
        () => {
          this.toastrService.success("Your account has been successfully verified!");
          this.router.navigate(['/login']);
        },
        (error) => {
          this.toastrService.error(error.error.Detail || 'Verification failed.', 'Error');
          this.router.navigate(['/register']);
        }
      );
  }
}
