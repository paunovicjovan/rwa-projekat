import { Component } from '@angular/core';
import { User } from '../../models/user.interface';
import { UserRoles } from '../../models/user-roles.enum';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {
  user : User= {
    id:1,
    email: 'paunovic.jovani3@gmail.com',
    firstName: 'Jovan',
    lastName: 'Paunovic',
    profileImage: null,
    role: UserRoles.USER,
    username: 'paun02'
  }
}
