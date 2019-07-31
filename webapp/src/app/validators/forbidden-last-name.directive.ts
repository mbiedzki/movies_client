import {Directive, forwardRef, Input} from '@angular/core';
import {NG_VALIDATORS, FormControl, Validator, AbstractControl, ValidatorFn} from '@angular/forms';
import {Director} from "../_directors/director";



export function forbiddenLastNameValidator(directors: Array<Director>): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    let forbidden;
    directors.forEach(director => {
      if (control.value == director.lastName) {
        forbidden = true;
      }
    });
    return forbidden ? {'forbiddenLastName': {value: control.value}} : null;
  };
}

@Directive({
  selector: '[appForbiddenLastName]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: ForbiddenLastNameValidatorDirective, multi: true }
  ]
})
export class ForbiddenLastNameValidatorDirective implements Validator {
  @Input('appForbiddenLastName') forbiddenNames: Array<Director>;

  validate(control: AbstractControl): {[key: string]: any} | null {
    return this.forbiddenNames ? forbiddenLastNameValidator(this.forbiddenNames)(control)
      : null;
  }
}

