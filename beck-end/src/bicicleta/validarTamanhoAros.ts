import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'validarTamanhoAros', async: false })
export class IsValidTamanhoAros implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const tamanhosDisponiveis = ['12','16','20','24','26','27,5','29'];
    return tamanhosDisponiveis.includes(value);
  }

  defaultMessage(args: ValidationArguments) {
    return `O tamanho do aro '${args.value}' não é válido. Os valores válidos são: 12, 16, 20, 24, 26, 27,5, 29`;
  }
}
