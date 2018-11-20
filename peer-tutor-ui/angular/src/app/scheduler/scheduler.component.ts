import { Component, OnInit, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { CalendarEvent, CalendarEventTimesChangedEvent, CalendarEventAction } from 'angular-calendar';
import { interval, Subject } from 'rxjs'

import { addHours, startOfDay, addDays } from 'date-fns';
import { ActivatedRoute } from '@angular/router';
import { DayViewHourSegment } from 'calendar-utils';
import { MatDialog } from '@angular/material';
import { AddScheduleModalComponent } from './add-schedule-modal/add-schedule-modal.component';

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
  green: {
    primary: '#009933',
    secondary: '#99ff99'
  },
  
};

//Place holder data
let users = [
  {
    id: 0,
    name: 'Tutor',
    color: colors.red
  },
  {
    id: 1,
    name: 'Peer',
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

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Deleted', event);
      }
    }
  ];
  handleEvent(action: string, event: CalendarEvent): void {
    console.log (action+": "+JSON.stringify(event));
  }

  //Place holder event
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
      title: 'An event',
      color: users[0].color,
      start: addDays(addHours(startOfDay(new Date()), 5),1),
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
      start: addDays(addHours(startOfDay(new Date()), 2),-1),
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
      color: colors.green,
      start: addHours(startOfDay(new Date()), 7),
      meta: {
        user: users[0]
      },
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true,
      actions: this.actions,
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
    public matDialog: MatDialog,
  ) 
  {
    this.activatedRoute.params.subscribe(params => this.scheduleId = params['id'] );
  }

  openDialog(): void {
    const dialogRef = this.matDialog.open(AddScheduleModalComponent, {
      width: '250px',
      data: {name: "ASDF_NAME", animal: "QWERT_NAME"}
    });

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

  startDragToCreate(segment: DayViewHourSegment,
    mouseDownEvent: MouseEvent,
    segmentElement: HTMLElement){
    //https://mattlewis92.github.io/angular-calendar/#/drag-to-create-events
    console.log ("CLICK!!")
    console.log(JSON.stringify(segment))
  }

}
