import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    private loginUsername:string;
    private loginPassword:string;
    private returnUrl:string;
    // private activatedRoute: ActivatedRoute;
    private submitted = false;
    
    private loginError = false;
    private loginErrorMsg:Object;

    /**
     * try to log in
     */
    tryLogin() {
        this.submitted = true;
        this.authenticationService.login(this.loginUsername, this.loginPassword)
            .pipe(first())
            .subscribe(
                data=>{this.router.navigate([this.returnUrl])},
                error=>{
                    this.loginError=true; 
                    this.loginErrorMsg=error.error.message; 
                    // console.log(error.error.message)
                }
            );
        // console.log(this.loginUsername + " " + this.loginPassword);
    }

    constructor(
        private authenticationService: AuthenticationService, 
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit() {
        // logout
        this.authenticationService.logout();
        // get return url from route parameters or default to '/'
        this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] ||  '/'; //this.activatedRoute.snapshot.queryParams['returnUrl'] ||
    }
}


//=======================Reference Example===================//
/*

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, AuthenticationService } from '../_services';

@Component({templateUrl: 'login.component.html'})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService) {}

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // reset login status
        this.authenticationService.logout();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}


*/