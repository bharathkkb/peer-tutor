import { Component, OnInit } from '@angular/core';

import { DataService } from '../data.service'
import { Observable } from 'rxjs'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  user$: Object;

  constructor(private data:DataService, private route:ActivatedRoute) {
    this.route.params.subscribe(x=>{this.user$=x.id;}) // "/details/:id" in app routing
  }

  ngOnInit() {
    this.data.getOneUser(this.user$).subscribe(x=>this.user$=x);
  }

}
