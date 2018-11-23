import { Component, OnInit, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { CalendarEvent, CalendarEventTimesChangedEvent, CalendarEventAction } from 'angular-calendar';
import { interval, Subject } from 'rxjs'

import { addHours, startOfDay, addDays } from 'date-fns';
import { ActivatedRoute } from '@angular/router';
import { DayViewHourSegment } from 'calendar-utils';
import { MatDialog } from '@angular/material';
import { AddScheduleModalComponent } from './add-schedule-modal/add-schedule-modal.component';
import { MeetingScheduleService, LocalStorageService, CURRENT_USER } from '../_services';

import { v4 } from 'uuid'

const colors = {
  /**Red is for Tutor */
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  /**Blue is for user */
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  /**Green is for meeting of the two */
  green: {
    primary: '#009933',
    secondary: '#99ff99'
  },
};

//Place holder data
const users = [
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

//place holder title
const EVENT_TITLE = "SOME EVENT"

/**Meta Data for a event. Contain info about meetings*/
class EventMeta {
  user: {id: number; name: string; color: {primary: string; secondary: string;}};
  meeting: {
    /**_id may not be useful */
    "_id"?: {
      "$oid": string;
    },
    "meeting_id": string;
    "peer_id": string;
    /**neither is selfReserved */
    "selfReserved"?: boolean;
    "tutor_id": string;
    [x:string]: any;
  }
}

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulerComponent implements OnInit {
  
  /**Tutor ID is determined by routing param and is used to GET tutor meetings*/
  tutorId:string;
  /**Peer ID is determined by localStorage of current user and is used to GET peer meetings */
  peerId:string;
  
  /**A list of events for tutor */
  tutorEvents: CalendarEvent[] = []
  /**A list of events for peer, AKA current User */
  peerEvents: CalendarEvent[] = []
  /**Events to be put into the view */
  events: CalendarEvent[] = [];
  
  /**Used to keep track of the Date in the calendar view */
  viewDate = new Date();

  /**A refresher for Angular Calendar. Need to put in directive. DO NOT TOUCH */
  refresh: Subject<any> = new Subject();
  
  /**get route parameters
   */
  constructor(
    private activatedRoute:ActivatedRoute,
    private zone:NgZone,
    private meetingScheduleService: MeetingScheduleService,
    private localStorageService: LocalStorageService,
    public matDialog: MatDialog,
  ) 
  {
    this.activatedRoute.params.subscribe(params => this.tutorId = params['studentid'] );
  }

  /**Plan:
   * 
   * 0. tutor Id is already populated with route param in cnstructor
   * 1. peer Id populated from local storage
   * 2. get tutor meeting list by tutor's student id. map to tutor eventlist. mark them green if it's a matched meeting.
   * 3. Push tutor eventlist to events
   * 4. peer do the same...
   * 5. push peer list as well
   * 
   * 
   * 3,4?> if play with uniclass schedule, need service that decipher schedule... rip
   */
  ngOnInit() {
    this.peerId = this.localStorageService.getCurrentUser()[CURRENT_USER.student_id.key];

    this.meetingScheduleService.getMeetingsByTutorId(this.tutorId).subscribe(
      meetings => {
        this.tutorEvents = meetings.map(
          (m):CalendarEvent<EventMeta> => {
            let resultEvent:CalendarEvent<EventMeta> = {
              start: new Date(m.start),
              end: new Date(m.end),
              title: EVENT_TITLE + m.meeting_id, //TODO: need to make some description
              id: m.meeting_id,
              color: m.peer_id === this.peerId? colors.green : colors.red,
              meta: {
                //https://stackoverflow.com/a/38874807
                //spread operator to do deep cloning:
                user: {...users[0]},
                meeting: {...m}
              },
            }

            //check if it is a meeting b/w tutor and peer
            if (m.tutor_id===this.tutorId && m.peer_id===this.peerId) {
              resultEvent.meta.user.color = colors.green;
            }

            return resultEvent;
          }
        )
        //another spread operator shenanigan.
        //https://stackoverflow.com/a/30846567
        this.events.push(...this.tutorEvents);
        //refresh the view
        this.refresh.next();
      },
      err => console.log(err)
    )

    this.meetingScheduleService.getMeetingsByPeerId(this.peerId).subscribe(
      meetings => {
        this.peerEvents = meetings.map(
          (m):CalendarEvent<EventMeta> => {
            let resultEvent:CalendarEvent<EventMeta> = {
              start: new Date(m.start),
              end: new Date(m.end),
              title: EVENT_TITLE + m.meeting_id, //TODO: need to make some description
              id: m.meeting_id,
              color: m.tutor_id === this.tutorId? colors.green : colors.blue,
              meta: {
                user: {...users[1]},
                meeting: {...m}
              }
            }

            //check if it is a meeting b/w tutor and peer
            if (m.tutor_id===this.tutorId && m.peer_id===this.peerId) {
              resultEvent.meta.user.color = colors.green;
            }

            return resultEvent;
          }
        )
        this.events.push(...this.peerEvents);
        //refresh the view
        this.refresh.next();
      },
      err => console.log(err)
    )

    console.log (new Date());

  }

  /**TODO: when user click their's own event, a modal pop up.
   * 
   * User then can either edit or cancel the meeting
   * 
   * @param action 
   * @param event 
   */
  handleEvent(action: string, event: CalendarEvent): void {
    if (event.id) {

    }
    console.log (action+": "+JSON.stringify(event));
  }

  /**TODO: when clicked on an empty hour segment, user can make meeting with tutor
   * 
   * TO BE REVISE, RESTRICTION? ETC.
   * 
   * @param date 
   */
  hourSegmentClicked(date: Date){
    console.log(date);
  }

  /**TODO: dont think i need this
   * 
   * @param param0 
   */
  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.events = [...this.events];
  }

  /**TODO: dont think i need this
   * 
   * spread operator MAY due to pointer/reference shenanigan
   * 
   * @param param0 
   */
  userChanged({ event, newUser }) {
    event.color = newUser.color;
    event.meta.user = newUser;
    this.events = [...this.events];
  }


  

  /**TODO: open add class modal
   */
  openDialog(): void {
    const dialogRef = this.matDialog.open(AddScheduleModalComponent, {
      width: '250px',
      data: {name: "ASDF_NAME", animal: "QWERT_NAME"}
    });

  }


  // clickToRefresh(){
  //   this.refresh.next();
  // }


  

  startDragToCreate(segment: DayViewHourSegment,
    mouseDownEvent: MouseEvent,
    segmentElement: HTMLElement){
    //https://mattlewis92.github.io/angular-calendar/#/drag-to-create-events
    console.log ("CLICK!!")
    console.log(JSON.stringify(segment))
  }

}
