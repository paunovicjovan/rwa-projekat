import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

  transform(value: Date | string | number): unknown {
    if(!value) return '';

    const date = new Date(value);
    const day = this.padWithZero(date.getDate());
    const month = this.padWithZero(date.getMonth() + 1);
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  }

  private padWithZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
}
