import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService, CURRENT_USER, UserService, RatingDataService, ClassDataService } from '../_services';
import { Student, Rating, UniClassSum, UniClass } from '../_models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

/**purely used for display */
interface RatingSummary {
  /**Comment given to the receiver */
  "comment": string;
  /**Student name who gave the rating */
  "giver_name": string;
  /**The Score. Keep it a string of number */
  "rating_score": string,
}

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
  studentRatingsSum$:RatingSummary[] = [];
  enrolledClasses$: UniClassSum[] = [];

  reviewFormGroup$: FormGroup;
  reviewFormAvaliable$ = false;

  constructor(
    private route: ActivatedRoute,
    private localStorageService:LocalStorageService,
    private ratingDataService:RatingDataService,
    private userService: UserService,
    private classDataService:ClassDataService,
    private formBuilder:FormBuilder,
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

    this.reviewFormGroup$ = this.formBuilder.group({
      "review-rating": ["",Validators.required],
      "review-comment": ["",Validators.required],
    })

    this.userService.getByStudentId(this.student_id$).subscribe(
      student=>{
        this.studentObj$ = student;
        this.enrolledClasses$ = this.studentObj$.enrolled_classes.map((c:UniClass)=>{return this.classDataService.toClassSum(c)});
      },
      err=>{console.log(`Error retrieve student profile: ${err}`)}
    )
    this.ratingDataService.getRatingsByReceivedStudentId(this.student_id$).subscribe(
      ratings=>{ //a list of Rating
        this.studentRatings$ = ratings
        this.studentRatingsSum$ = this.studentRatings$.map( //Map the Rating into a renderable Rating Summary
          r=>{
            let rSum:RatingSummary = {
              comment: r.comment,
              giver_name: "", //No name here... FML
              rating_score: r.rating_score,
            };
            return rSum;
          }
        );
        for(let i=0; i<this.studentRatingsSum$.length; i++){ //send GET to retrieve name for every rating...
          this.userService.getByStudentId(this.studentRatings$[i].given).subscribe(
            s=>{this.studentRatingsSum$[i].giver_name = s.name},
            err=>{console.log(`Error retrieve students who rated: ${err}`)}
          )
        }
      },
      err=>{console.log(`Error retrieve rating list: ${err}`)}
    )
  }

  submitReview(){
    console.log("Submitted")
  }

}
