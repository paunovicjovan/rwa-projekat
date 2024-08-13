import { Pipe, PipeTransform } from '@angular/core';
import { ProjectStatus } from '../../../features/projects/enums/project-status.enum';

@Pipe({
  name: 'translateProjectStatus'
})
export class TranslateProjectStatusPipe implements PipeTransform {

  transform(value: ProjectStatus | string): unknown {
    switch(value) {
      case ProjectStatus.OPENED:
      case 'opened':
        return 'Otvoren za prijave';
      case ProjectStatus.CLOSED:
      case 'closed':
        return 'Zatvoren za prijave';
      case ProjectStatus.COMPLETED:
      case 'completed':
        return 'Završen';
      default:
        return '';
    }
  }

}
