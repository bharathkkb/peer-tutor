import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    private registerUsername:string;
    private firstname:string;
    private lastname:string;
    private email:string;
    private registerPassword:string;

    private returnUrl:string;
    // private activatedRoute: ActivatedRoute;
    private submitted = false;
    
    private registerError = false;
    private registerErrorMsg:Object;

    /**
     * try to log in
     */
    tryregister() {
        this.submitted = true;
        // this.userService.register(this.registerUsername, this.registerPassword)
        //     .pipe(first())
        //     .subscribe(
        //         data=>{this.router.navigate([this.returnUrl])},
        //         error=>{
        //             this.registerError=true; 
        //             this.registerErrorMsg=error.error.message; 
        //             // console.log(error.error.message)
        //         }
        //     );
        let registrationObj:any = {
            username: this.registerUsername, 
            password: this.registerPassword, 
            firstName: this.firstname, 
            lastName: this.lastname,
            email: this.email,
        }

        this.userService.register(registrationObj)
            .pipe(first())
            .subscribe(
                data=>{this.router.navigate(['/login'])},
                error=>{this.registerError=true, 
                    console.log("err!!: "+error);
                    this.registerErrorMsg=error.error.message
                }
            )
        // console.log(this.registerUsername + " " + this.registerPassword);
    }

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private userService: UserService
    ) { }

    ngOnInit() {
    }
}