import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RegisterRequest } from '../../models/register-request.interface';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../state/app-state.interface';
import { register } from '../../state/auth.actions';
import { combineLatest, Observable } from 'rxjs';
import * as authSelectors from '../../state/auth.selectors';
import { createPasswordStrengthValidator } from '../../custom-form-validators/password-strength.validator';
import { createPasswordsMatchValidator } from '../../custom-form-validators/passwords-match.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  dataFromStore$!: Observable<any>;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.selectDataFromStore();
  }

  initializeForm() {
    this.registerForm = this.formBuilder.group(
      {
        firstName: [null, [Validators.required, Validators.minLength(3)]],
        lastName: [null, [Validators.required, Validators.minLength(3)]],
        username: [
          null,
          [
            Validators.required,
            Validators.minLength(3),
            Validators.pattern('^[a-z0-9_.]+$'),
          ],
        ],
        email: [null, [Validators.required, Validators.email]],
        password: [
          null,
          [
            Validators.required,
            Validators.minLength(5),
            createPasswordStrengthValidator(),
          ],
        ],
        passwordConfirm: [null, [Validators.required, Validators.minLength(5)]],
      },
      {
        validators: createPasswordsMatchValidator(),
      }
    );
  }

  selectDataFromStore() {
    this.dataFromStore$ = combineLatest({
      isSubmitting: this.store.select(authSelectors.selectIsSubmitting),
      error: this.store.select(authSelectors.selectErrorMessage),
    });
  }

  onRegisterFormSubmit() {
    const registerData: RegisterRequest = this.registerForm.getRawValue();
    this.store.dispatch(register({ registerRequest: registerData }));
  }

  get firstNameFormControl() {
    return this.registerForm.get('firstName') as FormControl;
  }

  get lastNameFormControl() {
    return this.registerForm.get('lastName') as FormControl;
  }

  get usernameFormControl() {
    return this.registerForm.get('username') as FormControl;
  }

  get emailFormControl() {
    return this.registerForm.get('email') as FormControl;
  }

  get passwordFormControl() {
    return this.registerForm.get('password') as FormControl;
  }

  get passwordConfirmFormControl() {
    return this.registerForm.get('passwordConfirm') as FormControl;
  }
}
