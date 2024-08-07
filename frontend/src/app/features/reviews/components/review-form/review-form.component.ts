import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReviewDialogData } from '../../models/review-dialog-data.interface';

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrl: './review-form.component.scss'
})
export class ReviewFormComponent implements OnInit {
  reviewForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private dialogRef: MatDialogRef<ReviewFormComponent>,
              @Inject(MAT_DIALOG_DATA) private dialogData: ReviewDialogData
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    //this.patchValuesToForm();
  }

  initializeForm() {
    this.reviewForm = this.formBuilder.group({
      rating: [this.dialogData.rating, [
        Validators.required,
        Validators.min(1),
        Validators.max(5)
      ]],
      content: [this.dialogData.content, [
        Validators.required,
        Validators.maxLength(1000)
      ]]
    });
  }

  // patchValuesToForm() {
  //   this.reviewForm.patchValue({
  //     rating: this.dialogData.rating,
  //     content: this.dialogData.content
  //   });
  // }

  handleCancelForm() {
    this.dialogRef.close(undefined);
  }

  handleSubmitForm() {
    const dialogResult: ReviewDialogData = {
      id: this.dialogData?.id,
      rating: this.reviewForm.get('rating')!.value,
      content: this.reviewForm.get('content')!.value,
      revieweeUsername: this.dialogData.revieweeUsername
    }
    this.dialogRef.close(dialogResult);
  }
}
