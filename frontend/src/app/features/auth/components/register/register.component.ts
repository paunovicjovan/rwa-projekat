import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterRequest } from '../../models/register-request.interface';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../state/app-state.interface';
import { register } from '../../state/auth.actions';
import { combineLatest, Observable } from 'rxjs';
import * as authSelectors from '../../state/auth.selectors';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  dataFromStore$!: Observable<any>;

  constructor(private formBuilder: FormBuilder,
              private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: [null, [Validators.required, Validators.minLength(3)]],
      lastName: [null, [Validators.required, Validators.minLength(3)]],
      username: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email]],
      password: [
        null,
        [
          Validators.required,
          Validators.minLength(5),
          //custom validator da sadrzi broj i specijalni znak
        ],
      ],
      passwordConfirm: [
        null,
        [
          Validators.required,
          Validators.minLength(5),
          //custom validator da sadrzi broj i specijalni znak
          //custom validator poklapanje sa password
        ],
      ],
    });

    
    this.dataFromStore$ = combineLatest({
      isSubmitting: this.store.select(authSelectors.selectIsSubmitting),
      error: this.store.select(authSelectors.selectErrorMessage)
    })
  }

  onRegisterFormSubmit() {
    const registerData : RegisterRequest = this.registerForm.getRawValue();
    this.store.dispatch(register({registerRequest: registerData}))
  }
}
