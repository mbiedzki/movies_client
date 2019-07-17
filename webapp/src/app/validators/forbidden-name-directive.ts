import {Directive, forwardRef, Input} from '@angular/core';
import {NG_VALIDATORS, FormControl, Validator, AbstractControl, ValidatorFn} from '@angular/forms';


export function forbiddenNameValidator(names: string[]): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    let forbidden;
    names.forEach(name => {
      if (control.value == name) {
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
  @Input('appForbiddenName') forbiddenNames: string[];

  validate(control: AbstractControl): {[key: string]: any} | null {
    return this.forbiddenNames ? forbiddenNameValidator(this.forbiddenNames)(control)
      : null;
  }
}

