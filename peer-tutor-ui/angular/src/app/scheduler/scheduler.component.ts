import { Component, OnInit, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { CalendarEvent, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { interval, Subject } from 'rxjs'

import { addHours, startOfDay } from 'date-fns';
import { ActivatedRoute } from '@angular/router';

//Place holder colors
const colors = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#000000'
  },
  
};

//Place holder data
let users = [
  {
    id: 0,
    name: 'Peer',
    color: colors.yellow
  },
  {
    id: 1,
    name: 'Tutor',
    color: colors.blue
  }
];

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulerComponent implements OnInit {

  scheduleId:string;

  viewDate = new Date();

  events: CalendarEvent[] = [
    {
      title: 'An event',
      color: users[0].color,
      start: addHours(startOfDay(new Date()), 5),
      meta: {
        user: users[0]
      },
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true
    },
    {
      title: 'Another event',
      color: users[1].color,
      start: addHours(startOfDay(new Date()), 2),
      meta: {
        user: users[1]
      },
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true
    },
    {
      title: 'An 3rd event',
      color: users[0].color,
      start: addHours(startOfDay(new Date()), 7),
      meta: {
        user: users[0]
      },
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true
    }
  ];

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.events = [...this.events];
  }

  userChanged({ event, newUser }) {
    event.color = newUser.color;
    event.meta.user = newUser;
    this.events = [...this.events];
  }

  constructor(
    private activatedRoute:ActivatedRoute,
    private zone:NgZone,
  ) 
  {
    this.activatedRoute.params.subscribe(params => this.scheduleId = params['id'] );
  }

  refresh: Subject<any> = new Subject();

  // clickToRefresh(){
  //   this.refresh.next();
  // }

  ngOnInit() {
    // interval(3000).subscribe(v=>{
    //   this.events.push({
    //     title: 'Dynamic',
    //     color: users[0].color,
    //     start: addHours(startOfDay(new Date()), v),
    //     meta: {
    //       user: users[0]
    //     },
    //     resizable: {
    //       beforeStart: false,
    //       afterEnd: false
    //     },
    //     draggable: false
    //   })
    //   this.refresh.next();
    //   console.log(JSON.stringify(this.events))
    // })
  }



}
