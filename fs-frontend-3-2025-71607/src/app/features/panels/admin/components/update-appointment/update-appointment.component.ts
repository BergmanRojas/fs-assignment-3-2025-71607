import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentService } from '../../../../appointments/services/appointment.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { AdminSidebarComponent } from '../../../admin/components/sidebar/adminSidebar.component';
import { Appointment } from '../../../../appointments/models/appointmentModel';
import { Patient } from '../../../patient/models/patientModel';
import { TokenComponent } from '../../../../../shared/components/token/token.component';
import { PatientService } from '../../../patient/services/patient.service';
import { DoctorService } from '../../../doctor/services/doctor.service';
import { Doctor } from '../../../doctor/models/doctor';

@Component({
  selector: 'app-update-appointment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminSidebarComponent,
    TokenComponent
  ],
  templateUrl: './update-appointment.component.html',
  styleUrls: ['./update-appointment.component.scss'],
})
export class UpdateAppointmentComponent implements OnInit {
  appointmentForm: FormGroup;
  appointment: Appointment;
  errorMessage: string = '';
  doctors: Doctor[] = [];
  patients: Patient[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private patientService: PatientService,
    private route: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAppointment();
    this.loadDoctors();
    this.loadPatients();
    this.setMinDateAndTime();
  }

  initForm(): void {
    this.appointmentForm = this.formBuilder.group({
      id: [''],
      date: ['', Validators.required],
      time: ['', Validators.required],
      status: [true, Validators.required],
      patientId: ['', Validators.required],
      patientFirstName: ['', Validators.required],
      patientLastName: ['', Validators.required],
      doctorId: ['', Validators.required],
    });
  }

  loadAppointment(): void {
    this.route.paramMap.subscribe((params) => {
      const appointmentId = +(params.get('id') || '0');
      if (appointmentId) {
        this.appointmentService.getAppointmentById(appointmentId).subscribe(
          (appointment) => {
            this.appointment = appointment;
            if (appointment) {
              this.loadDoctorAndPatientNames(
                appointment.doctorID,
                appointment.patientID
              );
              this.appointmentForm.patchValue({
                id: appointment.id,
                date: appointment.date,
                time: appointment.time,
                status: appointment.status,
                patientId: appointment.patientID,
                doctorId: appointment.doctorID,
              });
            }
          }
        );
      }
    });
  }

  loadDoctors(): void {
    this.doctorService.getDoctors(0, 100).subscribe((response) => {
      this.doctors = response.items;
    });
  }

  loadPatients(): void {
    this.patientService.getPatients(0, 100).subscribe((response) => {
      this.patients = response.items;
    });
  }

  loadDoctorAndPatientNames(doctorId: string, patientId: string): void {
    this.doctorService.getDoctorById(doctorId).subscribe((doctor) => {
      if (doctor) {
        this.appointmentForm.patchValue({
          doctorFirstName: doctor.firstName,
          doctorLastName: doctor.lastName,
        });
      }
    });

    this.patientService.getByPatientId(patientId, 0, 1).subscribe((patient) => {
      if (patient) {
        this.appointmentForm.patchValue({
          patientFirstName: patient.firstName,
          patientLastName: patient.lastName,
        });
      }
    });
  }

  setMinDateAndTime(): void {
    const today = new Date();
    const minDate = today.toISOString().split('T')[0];
    const hours = today.getHours().toString().padStart(2, '0');
    const minutes = today.getMinutes().toString().padStart(2, '0');
    const minTime = `${hours}:${minutes}`;

    (document.getElementById('date') as HTMLInputElement).setAttribute('min', minDate);
    (document.getElementById('time') as HTMLInputElement).setAttribute('min', minTime);
  }

  updateAppointment(): void {
    if (this.appointmentForm.valid) {
      const appointmentData = this.appointmentForm.value;
      const updatedAppointment: Appointment = {
        ...appointmentData,
        time: appointmentData.time + ':00',
      };

      this.appointmentService.updateAppointment(updatedAppointment.id, updatedAppointment).subscribe(
        () => {
          this.toastrService.success('Appointment updated successfully');
          this.router.navigate(['/upcoming-appointments']);
        }
      );
    } else {
      this.toastrService.error('Please fill out all required fields');
    }
  }
}
