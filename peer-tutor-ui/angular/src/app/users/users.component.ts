import { Component, OnInit } from '@angular/core';

import { DataService } from '../data.service'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users$: Object;

  //Dependancy Injection wizardry where Angular auto allocate a Dataservice Instance
  //? app.module.ts: provider:[...] ?//
  //DataService @Injectable({providedIn:'root'}), as per Angular6
  constructor(private data: DataService) { } 

  ngOnInit() {
    this.data.getUsers().subscribe(x=>{this.users$ = x;})
  }

}
