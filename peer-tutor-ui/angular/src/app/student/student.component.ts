import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService, CURRENT_USER, UserService, RatingDataService } from '../_services';
import { Student, Rating } from '../_models';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {

  student_id$: string = "";
  self_flag$: boolean = false;

  studentObj$: Student;
  studentRatings$: Rating[];

  constructor(
    private route: ActivatedRoute,
    private localStorageService:LocalStorageService,
    private ratingDataService:RatingDataService,
    private userService: UserService,
  ) 
  { 
    this.route.params.subscribe(param=>{
      this.student_id$ = param["id"];
      //check whether it's current user's self profile
      if (this.student_id$) {
        this.self_flag$ = this.localStorageService.getCurrentUser()[CURRENT_USER.student_id.key] === this.student_id$
      }
      else {
        this.student_id$ = this.localStorageService.getCurrentUser()[CURRENT_USER.student_id.key]
        this.self_flag$ = true;
      }
    })
  }

  ngOnInit() {
    this.userService.getByStudentId(this.student_id$).subscribe(
      student=>{this.studentObj$ = student},
      err=>{console.log(err)}
    )
    this.ratingDataService.getRatingsByReceivedStudentId(this.student_id$).subscribe(
      ratings=>{this.studentRatings$ = ratings},
      err=>{console.log(err)}
    )
  }

}
