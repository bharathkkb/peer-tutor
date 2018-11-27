import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService, CURRENT_USER, UserService, RatingDataService, ClassDataService } from '../_services';
import { Student, Rating, UniClassSum, UniClass } from '../_models';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {

  student_id$: string = "";
  self_flag$: boolean = false;

  studentObj$: Student = {
    enrolled_classes: [],
    meetings: [],
    name: "",
    student_id: "",
    username: "",
  };
  studentRatings$: Rating[] = [];
  enrolledClasses$: UniClassSum[] = [];

  constructor(
    private route: ActivatedRoute,
    private localStorageService:LocalStorageService,
    private ratingDataService:RatingDataService,
    private userService: UserService,
    private classDataService:ClassDataService,
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
      student=>{
        this.studentObj$ = student;
        this.enrolledClasses$ = this.studentObj$.enrolled_classes.map((c:UniClass)=>{return this.classDataService.toClassSum(c)});
      },
      err=>{console.log(err)}
    )
    this.ratingDataService.getRatingsByReceivedStudentId(this.student_id$).subscribe(
      ratings=>{this.studentRatings$ = ratings},
      err=>{console.log(err)}
    )
  }

}
