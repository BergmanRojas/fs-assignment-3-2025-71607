import { Pipe, PipeTransform } from '@angular/core';
import { Patient } from '../panels/patient/models/patientModel';

@Pipe({
  name: 'filterPatientIdentity',
  standalone: true
})
export class FilterPatientIdentityPipe implements PipeTransform {

  transform(value: Patient[], filterText: string): Patient[] {
    return filterText
      ? value.filter(
          (p: Patient) =>
            p.nationalIdentity.toLocaleLowerCase().indexOf(filterText) !== -1
        )
      : value;
  }

}
