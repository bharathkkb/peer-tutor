import { Component, OnInit } from '@angular/core';
import { ClassDataService } from '../_services';
import { UniClass } from '../_models/uniclass';
import { Router } from '@angular/router';

/**
 * Sumary of a UniClass
 */
class ClassSum {
  "_id": string;
  "class-name": string;
  "start-dates": string;
  "end-dates": string;
  "days": string;
  "instructor": string;
  "location": string;
  "start-time": string;
  "end-time": string;
  "title": string;
  "section": string;
}

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  classes$: ClassSum[];

  constructor( private classDataService:ClassDataService, private router:Router ) { }

  ngOnInit() {
    let currentUserId:string = localStorage.getItem("currentUser") ? JSON.parse(localStorage.getItem("currentUser"))["id"] : ""
    this.classDataService.getAll(currentUserId).subscribe(
      classes => { 
        this.classes$ = classes.map((c:UniClass)=>{
          let result:ClassSum = {
            "_id": c._id,
            "class-name": c["class-name"],
            "start-dates": c.dates.substring(0, 8),
            "end-dates": c.dates.substring(9, 17),
            "days": c.days,
            "instructor": c.instructor,
            "location": c.location,
            "start-time": c.time.substring(0, 4),
            "end-time": c.time.substring(5, 10),
            "title": c.title,
            "section": c.section,
          }
          return result
        }); 
      },
      error=>{
        console.log(error)
        // this.router.navigate(["/login"])
      }
    )
  }

}
