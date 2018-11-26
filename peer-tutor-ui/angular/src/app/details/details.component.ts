import {Component , OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { ClassDataService } from '../_services';
import { UniClass } from '../_models/uniclass';
import { ActivatedRoute } from '@angular/router'

export interface StudentElement {
  name: string;
  rating: number;
  comment: string;
  option: string;
}
class Student{

  "enrolled_classes": string[];
  "name": string;
  "student_id": string;
  "username":string;
}

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
  "students": Student[];
}


const ELEMENT_DATA: StudentElement[] = [
  {name: 'Sheldon',  rating: 5, comment: "", option: ''},
  {name: 'Bharath', rating: 5, comment: "", option: ''},
  {name: 'Lifeng',  rating: 5, comment: "", option: ''},
  {name: 'Albert',  rating: 5, comment: "", option: ''},
  {name: 'Jeju',  rating: 5, comment: "", option: ''},
  {name: 'Kedah',  rating: 5, comment: "", option: ''},
  {name: 'James',  rating: 5, comment: "", option: ''},
  {name: 'Kelvin', rating: 5, comment: "", option: ''},
  {name: 'Anothy', rating: 5, comment: "", option: ''},
  {name: 'Mary', rating: 5, comment: "", option: ''},
];

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
    "students": null,
  };

  constructor(private classDataService:ClassDataService, private route:ActivatedRoute, private router:Router) {
    this.route.params.subscribe(x=>{this.classId$=x.id;}) // "/details/:id" in app routing
  }
  displayedColumns: string[] = ['name', 'rating', 'comment', 'option'];
  dataSource = ELEMENT_DATA;

  goBack() {
    this.router.navigate([""]);
  }
  schedule() {
    
  }

  ngOnInit() {

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
          "students": uniClass.students,
        }  
      }
    )
  }
}

