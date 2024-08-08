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
  
  constructor(private router: Router) {}

  visitUserProfile() {
    this.router.navigateByUrl(`users/${this.user.username}`);
  }
}
