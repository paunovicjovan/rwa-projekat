import { Component, Input } from '@angular/core';
import { User } from '../../models/user.interface';
import { environment } from '../../../../../environments/environment.development';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-preview',
  templateUrl: './user-preview.component.html',
  styleUrl: './user-preview.component.scss'
})
export class UserPreviewComponent {

  @Input({required: true}) user!: User; 

  profileImageUrl!: string;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.profileImageUrl = this.user.profileImage ?
                           `${environment.apiUrl}/users/profile-image/${this.user.profileImage}` :
                           'assets/default-profile-image.jpg';
  }

  visitUserProfile() {
    this.router.navigateByUrl(`user-profile/${this.user.username}`);
  }
}
