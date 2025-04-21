import { Pipe, PipeTransform } from '@angular/core';
import { Appointment } from '../appointments/models/appointmentModel';

@Pipe({
  name: 'filterAppointmentIdentity',
  standalone: true
})
export class FilterAppointmentIdentityPipe implements PipeTransform {

  transform(value: Appointment[], filterText: string): Appointment[] {
    return filterText
      ? value.filter(
          (a: Appointment) =>
            a.patientNationalIdentity.toLocaleLowerCase().indexOf(filterText) !== -1
        )
      : value;
  }


}
