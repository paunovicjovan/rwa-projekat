import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../state/app-state.interface';
import { loadUserProfile } from '../../../features/users/state/users.actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  id: number = 21;

  constructor(private router: Router, 
              private store: Store<AppState>
  ) {}

  onClick() {
    this.store.dispatch(loadUserProfile({userId: this.id}))
    this.router.navigateByUrl('user-profile');
  }
}
