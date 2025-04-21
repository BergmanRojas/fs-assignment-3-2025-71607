import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientSidebarComponent } from '../sidebar/psidebar.component';
import { AppointmentForPatientPanel } from '../../../../appointments/models/appointmentforpatientpanel';
import { AppointmentService } from '../../../../appointments/services/appointment.service';
import { CreateAppointment } from '../../../../appointments/models/createAppointment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Patient } from '../../models/patientModel';
import { TokenComponent } from '../../../../../shared/components/token/token.component';
import { PatientService } from '../../services/patient.service';
import { DoctorService } from '../../../doctor/services/doctor.service';
import { DoctorForAppointment } from '../../../doctor/models/doctorForAppointment';

@Component({
  selector: 'app-create-appointment',
  standalone: true,
  templateUrl: './create-appointment.component.html',
  styleUrls: ['./create-appointment.component.scss'],
  imports: [CommonModule, FormsModule, PatientSidebarComponent, TokenComponent],
})
export class CreateAppointmentComponent implements OnInit {
  pageIndex: number = 0;
  pageSize: number = 100;

  doctors: DoctorForAppointment[] = [];
  appointments: AppointmentForPatientPanel[] = [];

  availableDates: string[] = [];
  selectedDoctor: DoctorForAppointment | null = null;
  selectedDate: string | null = null;
  selectedTime: string | null = null;

  timesWithStatus: { time: string; disabled: boolean }[] = [];

  constructor(
    private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private toastrService: ToastrService,
    private router: Router,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.patientService.getPatientProfile().subscribe((patient: Patient) => {
      if (patient.phone && patient.nationalIdentity) {
        this.doctorService.getDoctors(this.pageIndex, this.pageSize).subscribe((response) => {
          this.doctors = response.items;
        });
      } else {
        this.toastrService.warning(
          'Please complete your profile information before booking an appointment.'
        );
        this.router.navigate(['patient-profile']);
      }
    });
  }

  onDoctorChange(): void {
    this.selectedDate = null;
    this.timesWithStatus = [];
  }

  onDateChange(): void {
    if (this.selectedDoctor && this.selectedDate) {
      this.getDoctorAppointments();
      this.generateTimes();
    }
  }

  getDoctorAppointments(): void {
    if (this.selectedDoctor && this.selectedDate) {
      const formattedDate = this.selectedDate;
      this.appointmentService
        .getByDoctorDate(this.pageIndex, this.pageSize, this.selectedDoctor.id, formattedDate)
        .subscribe((response) => {
          this.appointments = response.items;
          this.updateAvailableTimes();
        });
    }
  }

  updateAvailableTimes(): void {
    this.timesWithStatus = this.timesWithStatus.map((timeSlot) => ({
      ...timeSlot,
      disabled: this.isTimeSlotBooked(timeSlot.time),
    }));
  }

  isTimeSlotBooked(time: string): boolean {
    return this.appointments.some((appointment) => {
      const appointmentTime = appointment.time.split(':').slice(0, 2);
      const slotTime = time.split(':').slice(0, 2);
      return appointmentTime[0] === slotTime[0] && appointmentTime[1] === slotTime[1];
    });
  }

  generateTimes(): void {
    this.timesWithStatus = [];
    const start = 9 * 60;
    const end = 17 * 60;
    for (let time = start; time <= end; time += 30) {
      this.timesWithStatus.push({
        time: this.formatTime(time),
        disabled: false,
      });
    }
    this.updateAvailableTimes();
  }

  formatTime(minutes: number): string {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }

  addAppointment(): void {
    this.patientService.getPatientProfile().subscribe((patient: Patient) => {
      if (this.selectedDate && this.selectedTime && this.selectedDoctor) {
        const formattedTime = this.selectedTime + ':00';
        const appointment: CreateAppointment = {
          date: this.selectedDate,
          time: formattedTime,
          status: true,
          doctorID: this.selectedDoctor.id,
          patientID: patient.id,
        };

        this.appointmentService.createAppointment(appointment).subscribe(
          () => {
            this.toastrService.success('Your appointment has been successfully created.');
            this.router.navigate(['patient-upcoming-appointments']);
          },
          (error) => {
            this.toastrService.error(error.error.Detail, 'Operation Failed');
          }
        );
      }
    });
  }
}
