import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppState } from '../../../../state/app-state.interface';
import { Store } from '@ngrx/store';
import * as usersActions from '../../state/users.actions';
import * as usersSelectors from '../../state/users.selectors';
import { combineLatest, filter, Observable, Subscription } from 'rxjs';
import { PersonalityScore } from '../../models/personality-score.interface';
import { CreatePersonalityScoreDto } from '../../models/create-personality-score-dto.interface';


@Component({
  selector: 'app-personality-test-page',
  templateUrl: './personality-test-page.component.html',
  styleUrl: './personality-test-page.component.scss'
})
export class PersonalityTestPageComponent implements OnInit {
  
  traitsForm!: FormGroup;
  isLoading$!: Observable<boolean>;
  personalityScoreSubscription?: Subscription;

  constructor(private formBuilder: FormBuilder,
              private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.store.dispatch(usersActions.loadPersonalityScore())
    this.selectDataFromStore();
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

  selectDataFromStore() {
    this.isLoading$ = this.store.select(usersSelectors.selectIsLoading);
    this.personalityScoreSubscription = this.store.select(usersSelectors.selectPersonalityScore)
                                        .subscribe((personalityScore: PersonalityScore | null) => {
                                          if(personalityScore)
                                            this.traitsForm.patchValue(personalityScore);
                                          else
                                            this.resetFormToDefaultValues();
                                        });
  }

  resetFormToDefaultValues() {
    Object.keys(this.traitsForm.controls).forEach(key => {
      this.traitsForm.get(key)?.setValue(1);
    });
  }

  savePersonalityScore() {
    console.log(this.traitsForm.getRawValue());
    const personalityScore: CreatePersonalityScoreDto = this.traitsForm.getRawValue();
    this.store.dispatch(usersActions.savePersonalityScore({personalityScore}));
  }

  ngOnDestroy(): void {
    this.personalityScoreSubscription?.unsubscribe();
  }
}
