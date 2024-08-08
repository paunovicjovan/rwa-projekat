import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { User } from '../../models/user.interface';
import { environment } from '../../../../../environments/environment.development';
import { AppState } from '../../../../state/app-state.interface';
import { select, Store } from '@ngrx/store';
import * as authSelectors from '../../../auth/state/auth.selectors';
import * as usersSelectors from '../../state/users.selectors';
import * as usersActions from '../../state/users.actions';
import { UserRoles } from '../../models/user-roles.enum';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { combineLatest, filter, Observable, Subscription } from 'rxjs';
import * as sharedActions from '../../../../shared/state/shared.actions';

@Component({
  selector: 'app-user-profile-details',
  templateUrl: './user-profile-details.component.html',
  styleUrl: './user-profile-details.component.scss'
})
export class UserProfileDetailsComponent implements OnInit {
  
  
  @Input({required: true}) username!: string;
  @ViewChild("profileImageUpload", {static:false}) profileImageUpload!:ElementRef;
  @ViewChild("userId", {static:false}) userIdControl!:ElementRef;

  dataFromStore$!: Observable<any>;
  apiUrl: string = environment.apiUrl;
  roles: string[] = Object.values(UserRoles);
  selectedRole!: UserRoles;
  imageChangedEvent: Event | null = null;
  croppedImage: Blob | null | undefined = null;
  
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    // this.store.dispatch(usersActions.loadUserProfile({ username: this.username }));
    this.loadUserProfile();

    // this.loggedInUserSubscription = this.store.select(authSelectors.selectCurrentLoggedInUser).subscribe((currentLoggedInUser)=>{
    //   this.loggedInUser = currentLoggedInUser;
    //   this.isOwnProfile = this.loggedInUser?.username === this.username;
    // });

    // this.chosenUserSubscription = this.store.select(usersSelectors.selectChosenUserProfile).pipe(
    //   filter((user: User | null) => user !== null)
    // )
    // .subscribe((user: User) => {
    //   this.user = user;
    //   this.selectedRole = user.role;
    // })
    this.selectDataFromStore();

  }

  loadUserProfile() {
    this.store.dispatch(usersActions.loadUserProfile({ username: this.username }));
  }

  selectDataFromStore() {
    this.dataFromStore$ = combineLatest({
      isLoading: this.store.select(usersSelectors.selectIsLoading),
      chosenUserProfile: this.store.select(usersSelectors.selectChosenUserProfile),
      loggedInUser: this.store.select(authSelectors.selectCurrentLoggedInUser),
    });
  }

  selectedFileChanged(event: Event) {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.blob;
  }

  openFileExplorerDialog() {
    // if(!this.isOwnProfile)
    //   return;

    const fileInput = this.profileImageUpload.nativeElement;
    fileInput.click();
  }

  cancelImageChange() {
    this.imageChangedEvent = null;
    this.profileImageUpload.nativeElement.value = null;
  }

  changeProfileImage() {
    if(!this.croppedImage) 
      return;

    const croppedImageFile = new File([this.croppedImage], 'profile-image.png', { type: 'image/png' });
    const formData = new FormData();
    formData.append('file', croppedImageFile);
    this.store.dispatch(usersActions.changeUserProfileImage({ formData }))
  }

  changeUserRole() {
    const userId = this.userIdControl.nativeElement.value;
    this.store.dispatch(usersActions.changeUserRole({userId, newRole: this.selectedRole}))
  }

  deleteUserAccount() {
    const userId = this.userIdControl.nativeElement.value;
    this.store.dispatch(sharedActions.openConfirmationDialog({
      message: "Da li sigurno želite da obrišete ovaj nalog?",
      actionToDispatch: usersActions.deleteUserAccount({userId})
    }))
  }
}
