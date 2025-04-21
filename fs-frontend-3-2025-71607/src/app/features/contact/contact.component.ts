import { Component } from '@angular/core';
import { BasicLayoutComponent } from '../../shared/components/basic-layout/basic-layout.component';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScrollService } from '../../shared/components/footer-content/scroll-service.service';
import { PatientService } from '../panels/patient/services/patient.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [BasicLayoutComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  patientFirstName: string = '';
  patientLastName: string = '';
  patientEmail: string = '';
  patientId: string = '';

  constructor(
    private patientService: PatientService,
    private toastrService: ToastrService,
    private router: Router,
    private scrollService: ScrollService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.toastrService.warning('Please log in to use the contact form.');
      this.router.navigateByUrl('/login');
      return;
    }

    this.patientService.getPatientProfile().subscribe((patient) => {
      this.patientFirstName = patient.firstName;
      this.patientLastName = patient.lastName;
      this.patientEmail = patient.email;
      this.patientId = patient.id;
    });
  }
}
