import { Component, OnInit, inject } from '@angular/core';
import { LoginResult } from './login-result';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { FormGroup, FormControl, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { BaseFormComponent } from '../base-form/base-form.component';
import { LoginRequest } from './login-request';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent extends BaseFormComponent implements OnInit {

  title?: string;
  loginResult?: LoginResult;
  matSnackBar = inject(MatSnackBar);


  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService) {
    super();
  }

  ngOnInit() {

    this.form = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }
  onSubmit() {
    var loginRequest = <LoginRequest>{};
    loginRequest.email = this.form.controls['email'].value;
    loginRequest.password = this.form.controls['password'].value;
    this.authService
      .login(loginRequest)
      .subscribe({
        next: (result) => {
          this.matSnackBar.open(result.message, 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
          });
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.log(error);
          if (error.status == 401) {
            this.loginResult = error.error;
          }
        }
      });
  }
}
