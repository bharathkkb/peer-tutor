import { Component, OnInit } from '@angular/core';

import { DataService } from '../data.service'
import { Observable } from 'rxjs'
import { ActivatedRoute } from '@angular/router'
import { ClassDataService } from '../_services';
import { UniClass } from '../_models/uniclass';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  classId$: string;
  uniClassDetail: UniClass;

  constructor(private classDataService:ClassDataService, private route:ActivatedRoute) {
    this.route.params.subscribe(x=>{this.classId$=x.id;) // "/details/:id" in app routing
  }

  ngOnInit() {
    // this.(this.user$).subscribe(x=>this.user$=x);
    this.classDataService.getById(this.classId$).subscribe(
      (uniClass:UniClass)=>{
        this.uniClassDetail = uniClass;
      }
    )
  }

}
