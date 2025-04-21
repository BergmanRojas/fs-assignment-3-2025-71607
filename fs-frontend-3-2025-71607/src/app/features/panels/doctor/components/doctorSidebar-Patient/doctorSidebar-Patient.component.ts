import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Patient } from '../../../patient/models/patientModel';

import { RouterModule } from '@angular/router';
import { DoctorSidebarComponent } from '../sidebar/doctorSidebar.component';

import { AppointmentService } from '../../../../appointments/services/appointment.service';
import { ResponseModel } from '../../../../models/responseModel';
import { Appointment } from '../../../../appointments/models/appointmentModel';
import { CapitalizeFirstPipe } from '../../../../pipe/capitalize-first.pipe';
import { FormsModule } from '@angular/forms';
import { FilterPatientIdentityPipe } from '../../../../pipe/filter-patient-identity.pipe';
import { TokenComponent } from '../../../../../shared/components/token/token.component';
import { PatientService } from '../../../patient/services/patient.service';
import { DoctorService } from '../../services/doctor.service';

@Component({
  selector: 'app-doctor-sidebar-patient',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DoctorSidebarComponent,
    CapitalizeFirstPipe,
    FormsModule,
    FilterPatientIdentityPipe,
    TokenComponent,
  ],
  templateUrl: './doctorSidebar-Patient.component.html',
  styleUrl: './doctorSidebar-Patient.component.scss',
})
export class DoctorSidebarPatientComponent implements OnInit {
  appointments: Appointment[] = [];
  patients: Patient[] = [];
  pageIndex: number = 0;
  pageSize: number = 12;
  filterText: string = '';

  constructor(
    private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.loadDoctorPatients();
  }

  loadDoctorPatients(): void {
    this.doctorService.getDoctorProfile().subscribe((doctor) => {
      const doctorId = doctor.id.toString();
      this.appointmentService
        .getDoctorAppointments(doctorId, this.pageIndex, this.pageSize)
        .subscribe((response: ResponseModel<Appointment>) => {
          const patientIds = new Set<string>();
          response.items.forEach((appointment) => {
            if (!patientIds.has(appointment.patientID)) {
              patientIds.add(appointment.patientID);
              this.patientService
                .getByPatientId(appointment.patientID, 0, 1)
                .subscribe((patientResponse: Patient) => {
                  const patient: Patient = {
                    address: patientResponse.address,
                    id: patientResponse.id,
                    age: patientResponse.age,
                    dateOfBirth: patientResponse.dateOfBirth,
                    firstName: patientResponse.firstName,
                    lastName: patientResponse.lastName,
                    nationalIdentity: patientResponse.nationalIdentity,
                    phone: patientResponse.phone,
                    height: patientResponse.height,
                    weight: patientResponse.weight,
                    bloodGroup: patientResponse.bloodGroup,
                    email: patientResponse.email,
                    appointmentDate: patientResponse.appointmentDate,
                    appointmentId: patientResponse.appointmentId,
                    appointmentRapor: patientResponse.appointmentRapor,
                    appointmentTime: patientResponse.appointmentTime,
                  };

                  this.patients.push(patient);
                  this.patients.sort((a, b) =>
                    a.firstName.localeCompare(b.firstName)
                  );
                });
            }
          });
        });
    });
  }
}
