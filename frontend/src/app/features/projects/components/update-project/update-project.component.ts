import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UpdateProjectDto } from '../../models/update-project-dto.interface';

@Component({
  selector: 'app-update-project',
  templateUrl: './update-project.component.html',
  styleUrl: './update-project.component.scss'
})
export class UpdateProjectComponent {
  projectForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private dialogRef: MatDialogRef<UpdateProjectComponent>,
              @Inject(MAT_DIALOG_DATA) public dialogData: UpdateProjectDto
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.projectForm = this.formBuilder.group({
      title: [this.dialogData.title, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20)]
      ],
      description: [this.dialogData.description, [
        Validators.required,
        Validators.minLength(20),
        Validators.maxLength(500)
      ]],
      requirements: [this.dialogData.requirements, [
        Validators.maxLength(500)
      ]],
      applicationLink: [this.dialogData.applicationLink],
      repositoryLink: [this.dialogData.repositoryLink]
    });
  }

  handleCancelForm() {
    this.dialogRef.close(undefined);
  }

  handleSubmitForm() {
    const dialogResult: UpdateProjectDto = {
      id: this.dialogData.id,
      status: this.dialogData.status,
      ...this.projectForm.getRawValue()
    }
    this.dialogRef.close(dialogResult);
  }

  get titleFormControl() {
    return this.projectForm.get('title') as FormControl;
  }
  
  get descriptionFormControl() {
    return this.projectForm.get('description') as FormControl;
  }

  get requirementsFormControl() {
    return this.projectForm.get('requirements') as FormControl;
  }
}
