import { CpfValidator } from './CpfValidator';

describe('CpfValidator', () => {
  it.each(['407.302.170-27', '684.053.160-00', '746.971.314-01'])('should test a valid cpf', (cpf) => {
    const cpfValidator = new CpfValidator();
    const isValid = cpfValidator.validate(cpf);
    expect(isValid).toBeTruthy();
  });
  it.each(['406.302.170-27', '406302170', '406302170123456789', '406302170123456789'])(
    'should test an invalid cpf',
    (cpf) => {
      const cpfValidator = new CpfValidator();
      const isValid = cpfValidator.validate(cpf);
      expect(isValid).toBeFalsy();
    },
  );
  it.each(['111.111.111-11', '222.222.222-22'])('should test an invalid cpf for all repeated numbers', (cpf) => {
    const cpfValidator = new CpfValidator();
    const isValid = cpfValidator.validate(cpf);
    expect(isValid).toBeFalsy();
  });
});
