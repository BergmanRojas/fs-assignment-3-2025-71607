import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './shared/components/footer/footer.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { DoctorListComponent } from './features/doctors/components/doctor-list/doctor-list.component';
import { ContactComponent } from './features/contact/contact.component';
import { HomePageComponent } from './routes/home-page/home-page.component';
import { AdminSidebarComponent } from './features/panels/admin/components/sidebar/adminSidebar.component';
import { PatientSidebarComponent } from './features/panels/patient/components/sidebar/psidebar.component';
import { DoctorSidebarComponent } from './features/panels/doctor/components/sidebar/doctorSidebar.component';
import { DoctorSidebarPatientComponent } from './features/panels/doctor/components/doctorSidebar-Patient/doctorSidebar-Patient.component';
import { PastAppointmentsComponent } from './features/panels/admin/components/list-appointment/past-appointments/past-appointments.component';
import { UpcomingAppointmentsComponent } from './features/panels/admin/components/list-appointment/upcoming-appointments/upcoming-appointments.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    RouterOutlet,
    FooterComponent,
    NavbarComponent,
    DoctorListComponent,
    ContactComponent,
    HomePageComponent,
    DoctorSidebarComponent,
    AdminSidebarComponent,
    PatientSidebarComponent,
    DoctorSidebarPatientComponent,
    PastAppointmentsComponent,
    UpcomingAppointmentsComponent,
  ]
})
export class AppComponent {
  title = 'hospital';
}
