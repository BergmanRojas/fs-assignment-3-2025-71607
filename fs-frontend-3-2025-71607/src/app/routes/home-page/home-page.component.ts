import { Component, OnInit } from '@angular/core';
import { BasicLayoutComponent } from '../../shared/components/basic-layout/basic-layout.component';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCalendar,
  faUserDoctor,
  faStethoscope,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';
import { SliderComponent } from '../../shared/components/slider/slider.component';
import { CommonModule } from '@angular/common';
import { DoctorSidebarComponent } from '../../features/panels/doctor/components/sidebar/doctorSidebar.component';
import { TokenService } from '../../core/auth/services/token.service';
import { ToastrService } from 'ngx-toastr';
import { LiveSupportIconComponent } from '../../shared/components/live-support-icon/live-support-icon.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  imports: [
    CommonModule,
    BasicLayoutComponent,
    RouterModule,
    SliderComponent,
    FontAwesomeModule,

    LiveSupportIconComponent
  ],
})
export class HomePageComponent implements OnInit {
  icon = faCalendar;
  icon2 = faUserDoctor;
  icon3 = faQuestionCircle;
  icon4 = faStethoscope;
  isLoggedIn: boolean = false;

  constructor(
    private tokenService: TokenService,
    private toastrService: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;
  }

  checkUserForAppointment() {
    if (this.isLoggedIn) {
      const userRoles = this.tokenService.getUserRole();
      if (userRoles.includes('Patients.Update')) {
        this.router.navigate(['create-appointment']);
      } else {
        this.toastrService.warning(
          "The appointment page is exclusive to patients. Please log in as a patient."
        );
      }
    } else {
      this.toastrService.warning(
        "The appointment page is exclusive to patients. Please log in as a patient."
      );
      this.router.navigate(['/login']);
    }
  }
}
