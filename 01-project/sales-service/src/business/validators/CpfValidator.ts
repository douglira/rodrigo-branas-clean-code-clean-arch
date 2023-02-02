import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'isCpf', async: false })
export class CpfValidator implements ValidatorConstraintInterface {
  private calculateDigit(cpf: string, factor: number): number {
    let total = 0;
    for (const digit of cpf) {
      if (factor > 1) total += parseInt(digit) * factor--;
    }
    const rest = total % 11;
    return rest < 2 ? 0 : 11 - rest;
  }

  private isValidLength(cpf: string): boolean {
    return cpf.length !== 11;
  }

  private allDigitsTheSame(cpf: string): boolean {
    return cpf.split('').every((c) => c === cpf[0]);
  }

  private extractCheckDigit(cpf: string): string {
    return cpf.substring(cpf.length - 2, cpf.length);
  }

  clean(cpf: string): string {
    return cpf.replace(/\D/g, '');
  }

  validate(cpf: string): boolean {
    if (!cpf) return false;
    cpf = this.clean(cpf);
    if (this.isValidLength(cpf)) return false;
    if (this.allDigitsTheSame(cpf)) return false;
    const digit1 = this.calculateDigit(cpf, 10);
    const digit2 = this.calculateDigit(cpf, 11);
    const actualDigit = this.extractCheckDigit(cpf);
    const calculatedDigit = `${digit1}${digit2}`;
    return actualDigit == calculatedDigit;
  }

  defaultMessage(): string {
    return 'Invalid CPF';
  }
}
