import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
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
import * as tagsSelectors from '../../../tags/state/tags.selectors';
import * as tagsActions from '../../../tags/state/tags.actions';
import { Tag } from '../../../tags/models/tag.interface';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UpdateUserDto } from '../../models/update-user-dto.interface';
import { RoleChangeDialogData } from '../../models/role-change-dialog-data.interface';

@Component({
  selector: 'app-user-profile-details',
  templateUrl: './user-profile-details.component.html',
  styleUrl: './user-profile-details.component.scss'
})
export class UserProfileDetailsComponent implements OnInit, OnChanges {
  @Input({required: true}) username!: string;
  @ViewChild("imageUploadControl", {static:false}) imageUploadControl!:ElementRef;

  dataFromStore$!: Observable<any>;
  isEditing: boolean = false;
  userDataForm!: FormGroup;

  imageChangedEvent: Event | null = null;
  croppedImage: Blob | null | undefined = null;

  constructor(private store: Store<AppState>,
              private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeUserDataForm();
    this.selectDataFromStore();
  }

  initializeUserDataForm() {
    this.userDataForm = this.formBuilder.group({
      username: [null, [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^[a-z0-9_.]+$')]
      ],
      firstName: [null, 
        [Validators.required, 
         Validators.minLength(3)]
        ],
      lastName: [null, 
        [Validators.required,
           Validators.minLength(3)]
        ],
    })
  }

  selectDataFromStore() {
    this.dataFromStore$ = combineLatest({
      isLoading: this.store.select(usersSelectors.selectIsLoading),
      userProfile: this.store.select(usersSelectors.selectChosenUserProfile),
      loggedInUser: this.store.select(authSelectors.selectCurrentLoggedInUser),
      tags: this.store.select(tagsSelectors.selectLoadedTags)
    });
  }

  ngOnChanges(): void {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.store.dispatch(usersActions.loadUserProfile({ username: this.username }));
  }

  selectedImageChanged(event: Event) {
    this.imageChangedEvent = event;
  }

  onImageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.blob;
  }

  cancelImageChange() {
    this.imageChangedEvent = null;
    this.imageUploadControl.nativeElement.value = null;
  }

  submitImageChange() {
    if(!this.croppedImage) 
      return;

    const croppedImageFile = new File([this.croppedImage], 'profile-image.png', { type: 'image/png' });
    this.store.dispatch(usersActions.changeUserProfileImage({ newImage: croppedImageFile }))
  }

  showRoleChangeDialog(user: User) {
    const dialogData: RoleChangeDialogData = {
      userId: user.id,
      role: user.role
    }
    this.store.dispatch(usersActions.openRoleChangeDialog({dialogData}))
  }

  deleteUserAccount(userId: number) {
    this.store.dispatch(sharedActions.openConfirmationDialog({
      message: "Da li sigurno želite da obrišete ovaj nalog?",
      actionToDispatch: usersActions.deleteUserAccount({userId})
    }))
  }

  addTag(tag: Tag) {
    this.store.dispatch(tagsActions.addTagToUser({ tagId:tag.id }));
  }

  removeTag(tagId: number) {
    this.store.dispatch(tagsActions.removeTagFromUser({ tagId }));
  }

  switchToEditingMode(user: User) {
    this.isEditing = true;
    this.userDataForm.patchValue({...user});
  }

  cancelUserDataChanges() {
    this.isEditing = false;
  }

  saveUserDataChanges(userId: number) {
    const userData: UpdateUserDto = {
      id: userId,
      ...this.userDataForm.getRawValue()
    }
    this.store.dispatch(usersActions.updateUserData({userData}));
    this.isEditing = false;
  }

  get formUsername() {
    return this.userDataForm.get('username') as FormControl;
  }

  get formFirstName() {
    return this.userDataForm.get('firstName') as FormControl;
  }

  get formLastName() {
    return this.userDataForm.get('lastName') as FormControl;
  }
}
