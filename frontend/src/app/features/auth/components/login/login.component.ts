import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../state/app-state.interface';
import { login } from '../../state/auth.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [
        Validators.required,
        Validators.email
      ]],
      password: [null, [Validators.required]]
    })
  }

  onLoginFormSubmit() {
    const credentials = this.loginForm.getRawValue();
    this.store.dispatch(login({loginRequest: credentials}))
  }

}
