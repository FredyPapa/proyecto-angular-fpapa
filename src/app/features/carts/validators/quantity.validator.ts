import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador personalizado para la cantidad de productos.
 * - No permite valores nulos, vacíos o espacios en blanco.
 * - Requiere que sea un número mayor o igual a 1.
 * - Requiere que sea un número entero.
 */
export function quantityValidator(min: number = 1): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value === null || value === undefined || value === '' || (typeof value === 'string' && value.trim() === '')) {
      return { requiredQuantity: 'La cantidad no puede estar vacía' };
    }

    const numValue = Number(value);

    if (isNaN(numValue)) {
      return { invalidQuantity: 'Debe ser un número válido' };
    }

    if (!Number.isInteger(numValue)) {
      return { integerQuantity: 'La cantidad debe ser un número entero' };
    }

    if (numValue < min) {
      return { minQuantity: { requiredMin: min, actual: numValue, message: `La cantidad mínima es ${min}` } };
    }

    return null;
  };
}
