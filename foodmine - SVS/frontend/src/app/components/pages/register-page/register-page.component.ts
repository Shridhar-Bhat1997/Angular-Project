import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { IUserRegister } from 'src/app/shared/interfaces/IUserRegister';
import { PasswordsMatchValidator } from 'src/app/shared/validators/password_match_validators';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {

  // Form group to handle user registration inputs
  registerForm!: FormGroup;

  // Flag to track form submission
  isSubmitted = false;

  // URL to redirect after successful registration
  returnUrl = '';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Initialize the registration form with validation rules
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', Validators.required],
      address: ['', [Validators.required, Validators.minLength(10)]]
    }, {
      // Custom validator to ensure password and confirm password match
      validators: PasswordsMatchValidator('password', 'confirmPassword')
    });

    // Retrieve the return URL from query parameters
    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl;
  }

  // Helper function to access form controls
  get fc() {
    return this.registerForm.controls;
  }

  // Handle registration form submission
  submit() {
    // Set the form submission flag to true
    this.isSubmitted = true;

    // Check if the form is valid
    if (this.registerForm.invalid) return;

    // Extract form values
    const fv = this.registerForm.value;

    // Create a user object from form values
    const user: IUserRegister = {
      name: fv.name,
      email: fv.email,
      password: fv.password,
      confirmPassword: fv.confirmPassword,
      address: fv.address
    };

    // Call the registration service and navigate on success
    this.userService.register(user).subscribe(_ => {
      this.router.navigateByUrl(this.returnUrl);
    });
  }
}
