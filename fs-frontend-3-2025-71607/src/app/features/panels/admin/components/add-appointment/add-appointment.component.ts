import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AppointmentService } from '../../../../appointments/services/appointment.service';
import { Patient } from '../../../patient/models/patientModel';
import { AppointmentForPatientPanel } from '../../../../appointments/models/appointmentforpatientpanel';
import { DoctorForAppointment } from '../../../doctor/models/doctorForAppointment';
import { CreateAppointment } from '../../../../appointments/models/createAppointment';
import { TokenService } from '../../../../../core/auth/services/token.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TokenComponent } from '../../../../../shared/components/token/token.component';
import { PatientService } from '../../../patient/services/patient.service';
import { AdminSidebarComponent } from '../sidebar/adminSidebar.component';
import { DoctorService } from '../../../doctor/services/doctor.service';

@Component({
  selector: 'app-add-appointment',
  templateUrl: './add-appointment.component.html',
  styleUrls: ['./add-appointment.component.scss'],
  standalone: true,
  imports: [FormsModule, AdminSidebarComponent, CommonModule, TokenComponent],
})
export class AddAppointmentComponent implements OnInit {
  pageIndex: number = 0;
  pageSize: number = 100;

  doctors: DoctorForAppointment[] = [];
  patients: Patient[] = [];
  appointments: AppointmentForPatientPanel[] = [];
  availableDates: string[] = [];
  selectedDoctor: DoctorForAppointment | null = null;
  selectedPatient: Patient | null = null;
  selectedDate: string | null = null;
  selectedTime: string | null = null;
  timesWithStatus: { time: string; disabled: boolean }[] = [];

  constructor(
    private patientService: PatientService,
    private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private tokenService: TokenService,
    private toastrService: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getPatients();
    this.getDoctors();
  }

  getPatients(): void {
    this.patientService.getPatients(this.pageIndex, this.pageSize).subscribe((response: any) => {
      this.patients = response.items || [];
    });
  }

  getDoctors(): void {
    this.doctorService.getDoctors(this.pageIndex, this.pageSize).subscribe((response: any) => {
      this.doctors = response.items || [];
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
      const formattedDate = this.formatDate(this.selectedDate);
      this.appointmentService
        .getAppointmentsByDoctorAndDate(String(this.selectedDoctor.id), formattedDate)
        .subscribe((response: any) => {
          this.appointments = response.items || [];
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
      const appointmentTime = appointment.time?.split(':').slice(0, 2);
      const slotTime = time.split(':').slice(0, 2);
      return appointmentTime[0] === slotTime[0] && appointmentTime[1] === slotTime[1];
    });
  }

  generateTimes(): void {
    this.timesWithStatus = [];
    const start = 9 * 60; // 09:00
    const end = 17 * 60; // 17:00
    for (let time = start; time <= end; time += 30) {
      this.timesWithStatus.push({
        time: this.formatTime(time),
        disabled: false,
      });
    }
    this.updateAvailableTimes();
  }

  formatDate(date: string): string {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }

  formatTime(minutes: number): string {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }

  addAppointment(): void {
    if (this.selectedDoctor && this.selectedDate && this.selectedTime && this.selectedPatient) {
      const formattedTime = this.selectedTime + ':00';
      const appointment: CreateAppointment = {
        date: this.selectedDate,
        time: formattedTime,
        status: true,
        doctorID: this.selectedDoctor.id,
        patientID: this.selectedPatient.id,
      };
      this.appointmentService.createAppointment(appointment).subscribe(() => {
        this.toastrService.success('Your appointment has been successfully created.');
        this.router.navigate(['upcoming-appointments']);
      });
    } else {
      this.toastrService.error('Please fill in all required fields.');
    }
  }
}
