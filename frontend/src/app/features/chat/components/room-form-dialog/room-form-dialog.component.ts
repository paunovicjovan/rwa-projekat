import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RoomDialogData } from '../../models/room-dialog-data.interface';
import { User } from '../../../users/models/user.interface';

@Component({
  selector: 'app-room-form-dialog',
  templateUrl: './room-form-dialog.component.html',
  styleUrl: './room-form-dialog.component.scss'
})
export class RoomFormDialogComponent {
  roomForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private dialogRef: MatDialogRef<RoomFormDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private dialogData: RoomDialogData
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.roomForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required]],
      description: [null, [
        Validators.maxLength(100)
      ]],
      users: this.formBuilder.array([], [
        Validators.required
      ])
    });
  }

  handleCancelForm() {
    this.dialogRef.close(undefined);
  }

  handleSubmitForm() {
    const dialogResult: RoomDialogData = {
      ...this.roomForm.getRawValue(),
      id: this.dialogData?.id
    }
    this.dialogRef.close(dialogResult);
  }

  addUserToForm(user: User) {
    if(this.findUserIndexInForm(user.id) >= 0)
      return;

    const newUserFormControl = new FormControl({...user});
    this.users.push(newUserFormControl);
  }

  removeUserFromForm(userId: number) {
    const userIndex = this.findUserIndexInForm(userId);
    this.users.removeAt(userIndex);
  }

  findUserIndexInForm(userId: number): number {
    const userIndex = this.users.value.findIndex((user: User) => user.id === userId);
    return userIndex;
  }

  get name(): FormControl {
    return this.roomForm.get('name') as FormControl;
  }

  get description(): FormControl {
    return this.roomForm.get('description') as FormControl;
  }

  get users(): FormArray {
    return this.roomForm.get('users') as FormArray;
  }
}
