import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../models/user.interface';

@Component({
  selector: 'app-user-profile-details',
  templateUrl: './user-profile-details.component.html',
  styleUrl: './user-profile-details.component.scss'
})
export class UserProfileDetailsComponent implements OnInit {
  
  
  @Input({required: true}) user!: User;
  @Input({required: true}) apiUrl!: string;

  profileImageUrl!: string;

  ngOnInit(): void {
    this.profileImageUrl = this.user.profileImage ?
                           `${this.apiUrl}/users/profile-image/${this.user.profileImage}` :
                           'assets/default-profile-image.jpg';
  }
}
