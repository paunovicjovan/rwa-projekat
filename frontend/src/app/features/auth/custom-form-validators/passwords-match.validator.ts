import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function createPasswordsMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const passwordConfirm = control.get('passwordConfirm')?.value;

    if (
      password === passwordConfirm &&
      password !== null &&
      passwordConfirm !== null
    ) {
      return null;
    } 
    else {
      return { passwordsNotMatching: true };
    }
  };
}
