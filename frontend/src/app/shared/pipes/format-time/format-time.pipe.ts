import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {

  transform(value: Date | string | number): unknown {
    if (!value) return '';

    const date = new Date(value);
    const hours = this.padWithZero(date.getHours());
    const minutes = this.padWithZero(date.getMinutes());
  
    return `${hours}:${minutes}`;
  }

  private padWithZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

}
