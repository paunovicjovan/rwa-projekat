import { Pipe, PipeTransform } from '@angular/core';
import { UserRoles } from '../../../features/users/models/user-roles.enum';

@Pipe({
  name: 'translateRole'
})
export class TranslateRolePipe implements PipeTransform {

  transform(value: UserRoles | string): unknown {
    switch(value) {
      case UserRoles.ADMIN:
      case 'admin':
        return 'Administrator';
      case UserRoles.MODERATOR:
      case 'moderator':
        return 'Moderator';
      case UserRoles.USER:
      case 'user':
        return 'Korisnik';
      default:
        return '';
    }
  }

}
