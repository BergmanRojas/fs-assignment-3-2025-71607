export interface CreateAppointmentResponse{
  id:number,
  date: string,
  time: string,
  status: boolean,
  doctorID:string,
  patientID: string
}
