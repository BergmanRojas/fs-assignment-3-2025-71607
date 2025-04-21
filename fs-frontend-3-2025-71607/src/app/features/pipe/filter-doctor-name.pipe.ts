import { Pipe, PipeTransform } from '@angular/core';
import { Doctor } from '../panels/doctor/models/doctor';

@Pipe({
  name: 'filterDoctorName',
  standalone: true
})
export class FilterDoctorNamePipe implements PipeTransform {

  transform(value: Doctor[], filterText: string): Doctor[] {
    filterText = filterText ? filterText.toLocaleLowerCase() : "";
    return filterText
      ? value.filter(
          (d: Doctor) =>
            d.firstName.toLocaleLowerCase().indexOf(filterText) !== -1||
          d.lastName.toLocaleLowerCase().indexOf(filterText) !== -1
        )
      : value; // Eğer filtre metni yoksa, tüm doktotları döndür
  }

}
