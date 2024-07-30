import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { User } from '../../models/user.interface';
import { environment } from '../../../../../environments/environment.development';
import { AppState } from '../../../../state/app-state.interface';
import { select, Store } from '@ngrx/store';
import * as authSelectors from '../../../auth/state/auth.selectors';
import * as usersActions from '../../state/users.actions';
import { UserRoles } from '../../models/user-roles.enum';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-profile-details',
  templateUrl: './user-profile-details.component.html',
  styleUrl: './user-profile-details.component.scss'
})
export class UserProfileDetailsComponent implements OnInit, OnDestroy {
  
  
  @Input({required: true}) user!: User;
  @ViewChild("profileImageUpload", {static:false}) profileImageUpload!:ElementRef;
  loggedInUser!: User | null | undefined;
  isOwnProfile: boolean = false;
  apiUrl: string = environment.apiUrl;
  roles: string[] = Object.values(UserRoles);
  selectedRole!: UserRoles;
  imageChangedEvent: Event | null = null;
  croppedImage: Blob | null | undefined = null;
  storeSubscription?: Subscription;
  
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.storeSubscription = this.store.select(authSelectors.selectCurrentLoggedInUser).subscribe((currentLoggedInUser)=>{
      this.loggedInUser = currentLoggedInUser;
      this.isOwnProfile = this.loggedInUser?.id === this.user.id;
    });
    this.selectedRole = this.user.role;
  }

  selectedFileChanged(event: Event) {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.blob;
  }

  openFileExplorerDialog() {
    if(!this.isOwnProfile)
      return;

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
    this.store.dispatch(usersActions.changeUserRole({userId: this.user.id, newRole: this.selectedRole}))
  }

  deleteUserAccount() {
    this.store.dispatch(usersActions.deleteUserAccount({userId: this.user.id}))
  }

  ngOnDestroy(): void {
    this.storeSubscription?.unsubscribe();
  }
}
