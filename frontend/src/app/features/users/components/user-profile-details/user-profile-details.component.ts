import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../models/user.interface';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-user-profile-details',
  templateUrl: './user-profile-details.component.html',
  styleUrl: './user-profile-details.component.scss'
})
export class UserProfileDetailsComponent implements OnInit {
  
  
  @Input({required: true}) user!: User;

  profileImageUrl!: string;

  ngOnInit(): void {
    this.profileImageUrl = this.user.profileImage ?
                           `${environment.apiUrl}/users/profile-image/${this.user.profileImage}` :
                           'assets/default-profile-image.jpg';
  }
}
