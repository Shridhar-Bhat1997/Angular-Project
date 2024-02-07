import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  // UntypedFormGroup to represent the login form
  loginForm!: UntypedFormGroup;
  
  // Variable to track whether the form has been submitted
  isSubmitted = false;

  // Variable to store the returnUrl from query parameters
  returnUrl = '';

  // Constructor with injected services
  constructor(
    private formBuilder: UntypedFormBuilder,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize the loginForm with email and password controls
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // Retrieve returnUrl from query parameters
    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl;
  }

  // Helper function to get form controls
  get fc() {
    return this.loginForm.controls;
  }

  // Function to handle form submission
  submit() {
    // Mark the form as submitted
    this.isSubmitted = true;

    // Check if the form is invalid
    if (this.loginForm.invalid) return;

    // Call the login method from the UserService, passing email and password
    this.userService.login({ email: this.fc.email.value, password: this.fc.password.value }).subscribe(() => {
      // Navigate to the returnUrl after successful login
      this.router.navigateByUrl(this.returnUrl);
    });
  }
}
