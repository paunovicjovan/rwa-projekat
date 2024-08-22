import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../state/app-state.interface';
import { login } from '../../state/auth.actions';
import { combineLatest, Observable } from 'rxjs';
import * as authSelectors from '../../state/auth.selectors';
import { LoginRequest } from '../../models/login-request.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  dataFromStore$!: Observable<any>;

  constructor(private formBuilder: FormBuilder,
              private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.selectDataFromStore();
  }

  initializeForm() {
    this.loginForm = this.formBuilder.group({
      email: [null, [
        Validators.required,
        Validators.email
      ]],
      password: [null, [Validators.required]]
    });
  }

  selectDataFromStore() {
    this.dataFromStore$ = combineLatest({
      isSubmitting: this.store.select(authSelectors.selectIsSubmitting),
      error: this.store.select(authSelectors.selectErrorMessage)
    })
  }

  onLoginFormSubmit() {
    const credentials : LoginRequest = this.loginForm.getRawValue();
    this.store.dispatch(login({loginRequest: credentials}))
  }

  get emailFormControl() {
    return this.loginForm.get('email') as FormControl;
  }

  get passwordFormControl() {
    return this.loginForm.get('email') as FormControl;
  }
}
