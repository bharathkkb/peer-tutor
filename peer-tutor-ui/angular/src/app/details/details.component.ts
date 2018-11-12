import { Component, OnInit } from '@angular/core';

import { DataService } from '../data.service'
import { Observable } from 'rxjs'
import { ActivatedRoute } from '@angular/router'
import { ClassDataService } from '../_services';
import { UniClass } from '../_models/uniclass';
import { Router } from '@angular/router';

class UniClassDetail{
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
}

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  classId$: string;
  uniClassDetail: UniClassDetail;

  constructor(private classDataService:ClassDataService, private route:ActivatedRoute, private router:Router) {
    this.route.params.subscribe(x=>{this.classId$=x.id;}) // "/details/:id" in app routing
  }

  ngOnInit() {
    // this.(this.user$).subscribe(x=>this.user$=x);
    this.classDataService.getById(this.classId$).subscribe(
      (uniClass:UniClass)=>{
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
        }  
      }
    )
  }

  /**
   * Navigate back to home page
   */
  goBack(){
    this.router.navigate([""]);
  }

}
