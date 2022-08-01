import { UserNameValidatorDirective } from './forbidden-name-directive';

describe('UserNameValidatorDirective', () => {
  it('should create an instance', () => {
    const directive = new UserNameValidatorDirective();
    expect(directive).toBeTruthy();
  });
});
