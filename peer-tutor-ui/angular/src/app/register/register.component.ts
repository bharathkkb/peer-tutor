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
    // private registerUsername:string;
    firstname:string;
    lastname:string;
    email:string;
    registerPassword:string;
    studentId:string;

    returnUrl:string;
    // private activatedRoute: ActivatedRoute;
    submitted = false;
    
    registerError = false;
    registerErrorMsg:Object;

    /**
     * try to log in
     */
    tryregister() {
        this.submitted = true;
        
        let registrationObj:any = {
            name: this.firstname+" "+this.lastname,
            student_id: this.studentId.toString(),
            username: this.email,
            password: this.registerPassword, 
        }

        this.userService.register(registrationObj)
            .pipe(first())
            .subscribe(
                data=>{this.router.navigate(['/login'])},
                error=>{this.registerError=true;
                    switch (error.status){
                        case 400: this.registerErrorMsg = "BAD REQUEST! CHECK THE CODE!!"; break;
                        case 404: this.registerErrorMsg = "BACKEND API NOT FOUND!"; break;
                        case 403: this.registerErrorMsg = "This user has already registered!"; break;
                        default: this.registerErrorMsg = "CHECK CONSOLE FOR LOG!"; console.log(error);
                    }
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