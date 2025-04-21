import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'CapitalizeFirst',
  standalone: true,
})
export class CapitalizeFirstPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

}
