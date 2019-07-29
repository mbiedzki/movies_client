import {Directive, forwardRef, Input} from '@angular/core';
import {NG_VALIDATORS, FormControl, Validator, AbstractControl, ValidatorFn} from '@angular/forms';
import {Movie} from "../_movies/movie";

export function forbiddenTitleValidator(movies: Array<Movie>): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    let forbidden;
    movies.forEach(movie => {
      if (control.value == movie.title) {
        forbidden = true;
      }
    });
    return forbidden ? {'forbiddenTitle': {value: control.value}} : null;
  };
}

@Directive({
  selector: '[appForbiddenTitle]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: ForbiddenTitleValidatorDirective, multi: true }
  ]
})
export class ForbiddenTitleValidatorDirective implements Validator {
  @Input('appForbiddenTitle') forbiddenTitles: Array<Movie>;

  validate(control: AbstractControl): {[key: string]: any} | null {
    return this.forbiddenTitles ? forbiddenTitleValidator(this.forbiddenTitles)(control)
      : null;
  }
}

