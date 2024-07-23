import { Component, Input } from '@angular/core';
import { User } from '../../models/user.interface';

@Component({
  selector: 'app-user-profile-details',
  templateUrl: './user-profile-details.component.html',
  styleUrl: './user-profile-details.component.scss'
})
export class UserProfileDetailsComponent {
  
  @Input({required: true}) user!: User;

  
}
