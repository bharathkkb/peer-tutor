import { Component, OnInit } from '@angular/core';
import { Student } from '../_models';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../_services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {

  studentIdNotFoundFlag$ = false;
  searchedFlag$ = false;

  answerNotMatchedFlag$ = false;
  answerSubmittedFlag$ = false;

  secureQuestion$ = "";

  tempStudentObj$:Student = null;

  studentIdFormGroup$: FormGroup;
  secureQnAFormGroup$: FormGroup;
  newPasswordFormGroup$: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.studentIdFormGroup$ = this.formBuilder.group({
      "studentId": ["", Validators.required],
    });

    this.secureQnAFormGroup$ = this.formBuilder.group({
      "secureAnswer": ["", Validators.required],
    })

    this.newPasswordFormGroup$ = this.formBuilder.group({
      "newPassword": ["", Validators.required, Validators.minLength(8)],
      "confirmPassword": ["", Validators.required, Validators.minLength(8)],
    })
  }

  onSearchStudentId(){
    let id = <string>(this.studentIdFormGroup$.get("studentId").value)

    this.userService.getByStudentId(id).subscribe(
      u=>{
        this.tempStudentObj$ = u;
        this.secureQuestion$ = u.security_question;

        this.studentIdNotFoundFlag$ = false;
        this.searchedFlag$ = true;
      },
      err=>{
        console.log(err);
        this.studentIdNotFoundFlag$ = true;
        this.searchedFlag$ = true;
      }
    )
  }

  onAnswerSecureQuestion(){
    let ans = <string>(this.secureQnAFormGroup$.get("secureAnswer").value);
    if (this.tempStudentObj$){
      if (this.tempStudentObj$.security_answer.toUpperCase() === ans.toUpperCase()) {
        this.answerNotMatchedFlag$ = false;
        this.answerSubmittedFlag$ = true;
      }
      else {
        this.answerNotMatchedFlag$ = true;
        this.answerSubmittedFlag$ = false;
      }
    }
    else {
      console.log("temp student object NULL??")
    }
  }

  onConfirmNewPassword(){
    this.tempStudentObj$.password = <string>(this.newPasswordFormGroup$.get("newPassword").value)
    this.userService.update(this.tempStudentObj$).subscribe(
      s=>{this.router.navigate(['/login'])},
      err=>{console.log(err)}
    )
    
  }

}