import {
  ValidatorFn,
  AbstractControl,
  FormControl,
  ValidationErrors,
} from '@angular/forms';

export function requiredWithTrim(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    if (value === null || value === undefined || value.trim() === '') {
      return { required: true };
    }
    return null;
  };
}

export function maxFileSizeValidator(maxSize: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && control.value.size > maxSize) {
      return { maxFileSizeExceeded: true };
    } else {
      return null;
    }
  };
}

export function fileValidator(
  control: FormControl
): { [key: string]: any } | null {
  const allowedExtensions = /(\.pdf)$/i;
  if (
    !allowedExtensions.exec(control.value) &&
    control.value !== null &&
    control.value !== undefined &&
    control.value !== ''
  ) {
    return { invalidFileFormat: true };
  }
  return null;
}

export function requiredWithZero(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const isFalsy =
      control.value === undefined ||
      control.value === null ||
      control.value === '';
    const isZero = control.value === 0;
    return !isFalsy && isZero ? { required: true } : null;
  };
}
