import {Directive, forwardRef, Input} from '@angular/core';
import {NG_VALIDATORS, FormControl, Validator, AbstractControl, ValidatorFn} from '@angular/forms';
import {User} from "../users/user";


export function forbiddenNameValidator(users: Array<User>): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    let forbidden;
    users.forEach(user => {
      if (control.value == user.name) {
        forbidden = true;
      }
    });
    return forbidden ? {'forbiddenName': {value: control.value}} : null;
  };
}

@Directive({
  selector: '[appForbiddenName]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: ForbiddenValidatorDirective, multi: true }
  ]
})
export class ForbiddenValidatorDirective implements Validator {
  @Input('appForbiddenName') forbiddenNames: Array<User>;

  validate(control: AbstractControl): {[key: string]: any} | null {
    return this.forbiddenNames ? forbiddenNameValidator(this.forbiddenNames)(control)
      : null;
  }
}

