// Importing AbstractControl from the Angular forms module
import { AbstractControl } from "@angular/forms";

// Defining a custom validator function for matching passwords
export const PasswordsMatchValidator = (
  passwordControlName: string,
  confirmPasswordControlName: string
) => {
  // Validator function to be used in the form group
  const validator = (form: AbstractControl) => {
    // Retrieving the password and confirm password controls from the form group
    const passwordControl = form.get(passwordControlName);
    const confirmPasswordControl = form.get(confirmPasswordControlName);

    // Check if either control is not found, return early
    if (!passwordControl || !confirmPasswordControl) return;

    // Checking if the values of password and confirm password controls do not match
    if (passwordControl.value !== confirmPasswordControl.value) {
      // Setting an error on the confirm password control indicating a mismatch
      confirmPasswordControl.setErrors({ notMatch: true });
    } else {
      // If values match, check if 'notMatch' error exists, and remove it
      const errors = confirmPasswordControl.errors;
      if (!errors) return;

      delete errors.notMatch;
      confirmPasswordControl.setErrors(errors);
    }
  };

  // Returning the validator function
  return validator;
};
