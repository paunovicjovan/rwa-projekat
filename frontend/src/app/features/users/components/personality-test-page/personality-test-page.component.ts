import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppState } from '../../../../state/app-state.interface';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-personality-test-page',
  templateUrl: './personality-test-page.component.html',
  styleUrl: './personality-test-page.component.scss'
})
export class PersonalityTestPageComponent implements OnInit {
  
  traitsForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.traitsForm = this.formBuilder.group({
      adaptability: this.createFormControl(),
      extroversion: this.createFormControl(),
      independence: this.createFormControl(),
      workMotivation: this.createFormControl(),
      deadlineCommitment: this.createFormControl(),
      detailCommitment: this.createFormControl(),
      preferredTeamSize: this.createFormControl(),
      liveCommunication: this.createFormControl(),
      innovativeness: this.createFormControl()
    });
  }

  createFormControl(): FormControl {
    return new FormControl(1, [Validators.required, Validators.min(1), Validators.max(10)]);
  }

  savePersonalityScore() {
    console.log(this.traitsForm.getRawValue());
  }

}
