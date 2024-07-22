import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

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
          Validators.minLength(6),
          //custom validator da sadrzi broj i specijalni znak
        ],
      ],
      passwordConfirm: [
        null,
        [
          Validators.required,
          Validators.minLength(6),
          //custom validator da sadrzi broj i specijalni znak
          //custom validator poklapanje sa password
        ],
      ],
    });
  }

  onRegisterFormSubmit() {

  }
}
