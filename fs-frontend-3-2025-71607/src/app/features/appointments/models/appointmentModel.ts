export interface Appointment {
  id: number;
  date: Date;
  time: string;
  status: boolean;
  doctorID: string;
  doctorFirstName: string;
  doctorLastName: string;
  doctorTitle: string;
  patientID: string;
  patientFirstName: string;
  patientLastName: string;
  patientNationalIdentity: string;
  patientDateOfBirth: Date;
  patientPhone: string;
  patientAge: number;
}
