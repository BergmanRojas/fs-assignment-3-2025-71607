import { Pipe, PipeTransform } from '@angular/core';
import { ResponseReport } from '../reports/models/responseReport';

@Pipe({
  name: 'filterReportIdentity',
  standalone: true
})
export class FilterReportIdentityPipe implements PipeTransform {

  transform(value: ResponseReport[], filterText: string): ResponseReport[] {
    return filterText
      ? value.filter(
          (r: ResponseReport) =>
            r.patientIdentity.toLocaleLowerCase().indexOf(filterText) !== -1
        )
      : value;
  }


}
