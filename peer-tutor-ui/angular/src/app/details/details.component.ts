import {Component , OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { ClassDataService } from '../_services';
import { UniClass } from '../_models/uniclass';
import { ActivatedRoute } from '@angular/router'
import { Student } from '../_models'
import { RatingDataService } from '../_services';
import { DataSource } from '@angular/cdk/table';
import { Observable, BehaviorSubject, of, ReplaySubject } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';



/**UniClass Detail is used to actually render class's detail 
 * as well as retaining List of student in a detailed manner  
 */
interface UniClassDetail{
  /**kinda useless */
  "_id": string;
  "dept-name": string;
  "dept-id": string;
  "class-name": string;
  "class-code": string;
  "start-dates": string;
  "end-dates": string;
  "days": string;
  "instructor": string;
  "location": string;
  "start-time": string;
  "end-time": string;
  "title": string;
  "units": string;
  "section": string;
  "students": Student[];
}

/**StudentElement is elements used to render list of students enrolled in the class.
 * Need to retrieve rating and comment on top of the student info.
 */
interface StudentElement {
  name: string;
  rating: "No Rating Yet"|number;
  rate_count: number;
  comment: string;
  student_id: string;
}

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit{

  classId$: string;

  uniClassDetail: UniClassDetail = {
    "_id": "",
    "dept-name": "",
    "dept-id": "",
    "class-name": "",
    "class-code": "",
    "start-dates": "",
    "end-dates": "",
    "days": "",
    "instructor": "",
    "location": "",
    "start-time": "",
    "end-time": "",
    "title": "",
    "units": "",
    "section": "",
    "students": [],
  };

  constructor(
    private classDataService:ClassDataService, 
    private ratingDataService:RatingDataService,
    private route:ActivatedRoute, 
    private router:Router
    ) {
    this.route.params.subscribe(x=>{this.classId$=x.id;}) // "/details/:id" in app routing
  }
  displayedColumns$: string[] = ['name', 'rating', 'comment', 'option'];
  studentElementSource$:StudentElement[] = [];
  studentElement$:ReplaySubject<StudentElement[]> = new ReplaySubject<StudentElement[]>();
  

  goBack() {
    this.router.navigate([""]);
  }

  schedule(student:StudentElement) {
    this.router.navigate(["/","schedule",this.uniClassDetail["class-name"],student.student_id])
  }

  ngOnInit() {

    
    //GET class by class-code
    this.classDataService.getById(this.classId$).subscribe(
      (uniClass:UniClass)=>{
        //transform result into detail
        this.uniClassDetail = {
          _id: uniClass._id,
          "dept-name": uniClass["dept-name"],
          "dept-id": uniClass["dept-id"],
          "class-name": uniClass["class-name"],
          "class-code": uniClass["class-code"],
          "start-dates": uniClass.dates.substring(0, 8),
          "end-dates": uniClass.dates.substring(9, 17),
          days: uniClass.days,
          instructor: uniClass.instructor,
          location: uniClass.location,
          "start-time": uniClass.time.substring(0, 4),
          "end-time": uniClass.time.substring(5, 10),
          title: uniClass.title,
          units: uniClass.units,
          section: uniClass.section,
          "students": uniClass.students,
        };

        //iterate the list of student and GET their rating accordingly
        for (let s of this.uniClassDetail.students){
          let tempStudentElem:StudentElement={
            name: s.name,
            rating: "No Rating Yet",
            rate_count: 0,
            comment: "No Comment Yet",
            student_id: s.student_id.toString(),
          };
          this.ratingDataService.getRatingAvgByStudentId(tempStudentElem.student_id).subscribe(
            r=>{ // avg Rating exist
              if (r!=0) {tempStudentElem.rating = r;}
              this.ratingDataService.getRatingsByReceivedStudentId(tempStudentElem.student_id).subscribe(
                ratings=>{ //last comment exist
                  if (ratings.length>0) {
                    tempStudentElem.rate_count = ratings.length;
                    if (ratings[ratings.length-1].comment.length > 30) {
                      tempStudentElem.comment = ratings[ratings.length-1].comment.substring(0,30) + "..."
                    }
                    else {
                      tempStudentElem.comment = ratings[ratings.length-1].comment
                    }
                    // console.log(tempStudentElem.comment)
                  }
                  this.studentElementSource$.push(tempStudentElem);
                  this.studentElement$.next(this.studentElementSource$);
                },
                err => { //error retrieving last comment
                  console.log("Error getting rating comment")
                  this.studentElementSource$.push(tempStudentElem);
                  this.studentElement$.next(this.studentElementSource$);
                }
              )
            },
            error => {
              console.log("Error getting avg Rating")
              this.studentElementSource$.push(tempStudentElem);
              this.studentElement$.next(this.studentElementSource$);
            }
          )
        }
      }
    )
  }
}

/**DataSource for Dynamic data */
export class StudentElementDataSource implements DataSource<StudentElement> {

  private lessonsSubject = new BehaviorSubject<StudentElement[]>([]);

  constructor() {}

  connect(collectionViewer: CollectionViewer): Observable<StudentElement[]> {
    return null;
  }

  disconnect(collectionViewer: CollectionViewer): void {

  }

  loadLessons(courseId: number, filter: string,
              sortDirection: string, pageIndex: number, pageSize: number) {
    
  }  
}

