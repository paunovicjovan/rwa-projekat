import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RoomDialogData } from '../../models/room/room-dialog-data.interface';
import { User } from '../../../users/models/user.interface';

@Component({
  selector: 'app-room-form-dialog',
  templateUrl: './room-form-dialog.component.html',
  styleUrl: './room-form-dialog.component.scss'
})
export class RoomFormDialogComponent implements OnInit {
  roomForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private dialogRef: MatDialogRef<RoomFormDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private dialogData: RoomDialogData | undefined
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.roomForm = this.formBuilder.group({
      id: [this.dialogData?.id],
      name: [this.dialogData?.name, [Validators.required]],
      description: [this.dialogData?.description, [
        Validators.maxLength(100)
      ]],
      users: this.formBuilder.array([], [
        this.dialogData?.id ? Validators.nullValidator : Validators.required
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
    this.usersFormArray.push(newUserFormControl);
  }

  removeUserFromForm(user: User) {
    const userIndex = this.findUserIndexInForm(user.id);
    this.usersFormArray.removeAt(userIndex);
  }

  findUserIndexInForm(userId: number): number {
    const userIndex = this.usersFormArray.value.findIndex((user: User) => user.id === userId);
    return userIndex;
  }

  get nameFormControl(): FormControl {
    return this.roomForm.get('name') as FormControl;
  }

  get descriptionFormControl(): FormControl {
    return this.roomForm.get('description') as FormControl;
  }

  get usersFormArray(): FormArray {
    return this.roomForm.get('users') as FormArray;
  }
}
