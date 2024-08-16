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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UpdateUserDto } from '../../models/update-user-dto.interface';

@Component({
  selector: 'app-user-profile-details',
  templateUrl: './user-profile-details.component.html',
  styleUrl: './user-profile-details.component.scss'
})
export class UserProfileDetailsComponent implements OnInit, OnDestroy, OnChanges {
  @Input({required: true}) username!: string;
  @ViewChild("imageUploadControl", {static:false}) imageUploadControl!:ElementRef;

  dataFromStore$!: Observable<any>;
  userProfile: User | null = null;
  chosenUserSubscription?: Subscription;
  isEditing: boolean = false;
  userDataForm!: FormGroup;

  roles: string[] = Object.values(UserRoles);
  selectedRole!: UserRoles;
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
      loggedInUser: this.store.select(authSelectors.selectCurrentLoggedInUser),
      tags: this.store.select(tagsSelectors.selectLoadedTags)
    });

    this.chosenUserSubscription = this.store.select(usersSelectors.selectChosenUserProfile).pipe(
      filter((user: User | null) => user !== null)
    ).subscribe(
      (user: User | null) => {
        this.userProfile = user;
        this.selectedRole = user!.role;
      }
    )
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
    const formData = new FormData();
    formData.append('file', croppedImageFile);
    this.store.dispatch(usersActions.changeUserProfileImage({ formData }))
  }

  changeUserRole() {
    this.store.dispatch(usersActions.changeUserRole({userId: this.userProfile!.id, newRole: this.selectedRole}))
  }

  deleteUserAccount() {
    this.store.dispatch(sharedActions.openConfirmationDialog({
      message: "Da li sigurno želite da obrišete ovaj nalog?",
      actionToDispatch: usersActions.deleteUserAccount({userId: this.userProfile!.id})
    }))
  }

  addTag(tag: Tag) {
    this.store.dispatch(tagsActions.addTagToUser({ tagId:tag.id }));
  }

  removeTag(tagId: number) {
    this.store.dispatch(tagsActions.removeTagFromUser({ tagId }));
  }

  switchToEditingMode() {
    this.isEditing = true;
    this.userDataForm.patchValue({...this.userProfile});
  }

  cancelUserDataChanges() {
    this.isEditing = false;
  }

  saveUserDataChanges() {
    const userData: UpdateUserDto = {
      id: this.userProfile!.id,
      ...this.userDataForm.getRawValue()
    }
    this.store.dispatch(usersActions.updateUserData({userData}));
    this.isEditing = false;
  }

  ngOnDestroy(): void {
    this.chosenUserSubscription?.unsubscribe();
  }
}
