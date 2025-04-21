import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TokenService } from '../../../core/auth/services/token.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  isLoggedIn: boolean = false;

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token; // Token varsa true, yoksa false
  }

  directUsers() {
    const userRoles = this.tokenService.getUserRole();

    if (userRoles == 'Admin') this.router.navigate(['admin-charts']);
    // Başarılı girişten sonra yönlendirme
    else if (userRoles.includes('Doctors.Update'))
      this.router.navigate(['doctor-summary']);
    else if (userRoles.includes('Patients.Update'))
      this.router.navigate(['patient-summary']);
  }
  checkUserForAppointment() {
    if (this.isLoggedIn) {
      const userRoles = this.tokenService.getUserRole();
      if (userRoles.includes('Patients.Update')) {
        this.router.navigate(['create-appointment']);
      } else {
        this.toastrService.warning(
          'Randevu alma sayfası hastalara özeldir. Lütfen hasta olarak giriş yapın'
        );
      }
    } else {
      this.toastrService.warning(
        'Randevu alma sayfası hastalara özeldir. Lütfen hasta olarak giriş yapın'
      );
      this.router.navigate(['/login']);
    }
  }
}
