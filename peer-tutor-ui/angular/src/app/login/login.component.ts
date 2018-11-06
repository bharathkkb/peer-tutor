import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private loginUsername = "";
  private loginPassword = "";

  private testUsername = "";
  private testPassword = "";
  
  /**
   * try to log in
   */
  tryLogin() {
    if (this.checkUser(this.loginUsername).pass) {this.testUsername = this.loginUsername;}
    else {this.testUsername = this.checkUser(this.loginUsername).msg}
    if (this.checkPassword(this.loginPassword).pass) {this.testPassword = this.loginPassword;}
    else {this.testPassword = this.checkPassword(this.loginPassword).msg}
    
  }


  /**
   * check password and see if pass
   * @param p password to be checked
   */
  checkPassword(p:string):{pass:boolean, msg?:string}{
    if (p.length<8) return {pass:false, msg:"Too short"};
    return {pass:true};
  }

  /**
   * check password and see if pass
   * @param p password to be checked
   */
  checkUser(p:string):{pass:boolean, msg?:string}{
    if (p.length<=0) return {pass:false, msg:"No name"};
    return {pass:true};
  }

  constructor() { }

  ngOnInit() {
  }

}

/*

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../_services';

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
        private authenticationService: AuthenticationService) {}

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
                    // this.alertService.error(error);
                    this.loading = false;
                });
    }
}

*/