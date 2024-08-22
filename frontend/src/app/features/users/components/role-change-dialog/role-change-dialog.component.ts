import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RoleChangeDialogData } from '../../models/role-change-dialog-data.interface';
import { UserRoles } from '../../models/user-roles.enum';

@Component({
  selector: 'app-role-change-dialog',
  templateUrl: './role-change-dialog.component.html',
  styleUrl: './role-change-dialog.component.scss'
})
export class RoleChangeDialogComponent {

  roleForm!: FormGroup;
  roles: string[] = Object.values(UserRoles);

  constructor(private formBuilder: FormBuilder,
              private dialogRef: MatDialogRef<RoleChangeDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public dialogData: RoleChangeDialogData
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.roleForm = this.formBuilder.group({
      userId: [this.dialogData.userId],
      role: [this.dialogData.role, [
        Validators.required
      ]]
    });
  }

  handleCancelForm() {
    this.dialogRef.close(undefined);
  }

  handleSubmitForm() {
    this.dialogRef.close(this.roleForm.getRawValue());
  }

  get roleFormControl() {
    return this.roleForm.get('role') as FormControl;
  }
}
