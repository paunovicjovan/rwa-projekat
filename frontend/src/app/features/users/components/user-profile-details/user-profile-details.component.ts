import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { User } from '../../models/user.interface';
import { environment } from '../../../../../environments/environment.development';
import { AppState } from '../../../../state/app-state.interface';
import { select, Store } from '@ngrx/store';
import * as authSelectors from '../../../auth/state/auth.selectors';
import * as usersActions from '../../state/users.actions';
import { UserRoles } from '../../models/user-roles.enum';

@Component({
  selector: 'app-user-profile-details',
  templateUrl: './user-profile-details.component.html',
  styleUrl: './user-profile-details.component.scss'
})
export class UserProfileDetailsComponent implements OnInit {
  
  
  @Input({required: true}) user!: User;
  @ViewChild("profileImageUpload", {static:false}) profileImageUpload!:ElementRef;
  loggedInUser!: User | null | undefined;
  isOwnProfile: boolean = false;
  apiUrl: string = environment.apiUrl;
  roles: string[] = Object.values(UserRoles);
  selectedRole!: UserRoles;
  
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.select(authSelectors.selectCurrentLoggedInUser).subscribe((currentLoggedInUser)=>{
      this.loggedInUser = currentLoggedInUser;
      this.isOwnProfile = this.loggedInUser?.id === this.user.id;
    });
    this.selectedRole = this.user.role;
  }

  chooseNewProfileImage() {
    if(!this.isOwnProfile)
      return;
    const fileInput = this.profileImageUpload.nativeElement;
    fileInput.click();
    console.log('Promena slike');
  }

  changeUserRole() {
    this.store.dispatch(usersActions.changeUserRole({userId: this.user.id, newRole: this.selectedRole}))
  }
}
