import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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

  handleCancelForm() {
    this.dialogRef.close(undefined);
  }

  handleSubmitForm() {
    const dialogResult: ReviewDialogData = {
      id: this.dialogData?.id,
      rating: this.ratingFormControl!.value,
      content: this.contentFormControl!.value,
      revieweeUsername: this.dialogData.revieweeUsername
    }
    this.dialogRef.close(dialogResult);
  }

  get ratingFormControl() {
    return this.reviewForm.get('rating') as FormControl;
  }

  get contentFormControl() {
    return this.reviewForm.get('content') as FormControl;
  }
}
