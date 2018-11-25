import { Component, OnInit, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { CalendarEvent, CalendarEventTimesChangedEvent, CalendarEventAction } from 'angular-calendar';
import { interval, Subject } from 'rxjs'

import { addHours, startOfDay, addDays, isWithinRange, subMinutes, addMinutes } from 'date-fns';
import { ActivatedRoute } from '@angular/router';
import { DayViewHourSegment } from 'calendar-utils';
import { MatDialog } from '@angular/material';
import { AddScheduleModalComponent, AddScheduleEventInputData } from './add-schedule-modal/add-schedule-modal.component';
import { MeetingScheduleService, LocalStorageService, CURRENT_USER, UserService } from '../_services';

import { v4 as uuidV4} from 'uuid'

/**Color for Red, Green, Blue */
const COLORS = {
  /**Red is for Opponent event, unrelated to user*/
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  /**Yellow is for Self event, unrelated to opponent */
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  },
  /**Blue is for event with User as tutor and Opponent as peer */
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  /**Green is for event with Opponent as tutor and User as peer */
  green: {
    primary: '#009933',
    secondary: '#99ff99'
  },
};

/**Default column */
let USERS = [
  {
    id: 0,
    name: 'Other',
  },
  {
    id: 1,
    name: 'Self',
  }
];

//place holder title
const EVENT_TITLE = "SOME EVENT"

/**Meta Data for a event. Contain info about meetings*/
export interface EventMeta {
  user: {id: number; name: string;};
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
  opponentId:string;
  /**Peer ID is determined by localStorage of current user and is used to GET peer meetings */
  selfId:string;
  /**class name selected in route. used to automatically denote meeting title */
  className:string;
  
  /**A list of events for tutor */
  opponentEvents: CalendarEvent<EventMeta>[] = []
  /**A list of events for peer, AKA current User */
  selfEvents: CalendarEvent<EventMeta>[] = []
  /**Events to be put into the view */
  events: CalendarEvent<EventMeta>[] = [];
  
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
    private userService: UserService,
    public matDialog: MatDialog,
  ) 
  {
    this.activatedRoute.params.subscribe(params => {this.opponentId = params['studentid']; this.className = params['classname']}  );
  }

  /**Routine:
   * 
   * 0. tutor Id is already populated with route param in cnstructor
   * 1. peer Id populated from local storage
   * 2. get tutor meeting list by tutor's student id. map to tutor eventlist. mark colors accordingly (see colors const)
   * 3. Push tutor eventlist to events
   * 4. peer do the same...
   * 5. push peer list as well
   * 
   * 
   * 3,4?> if play with uniclass schedule, need service that decipher schedule... rip
   */
  ngOnInit() {
    this.selfId = this.localStorageService.getCurrentUser()[CURRENT_USER.student_id.key];

    this.userService.getByStudentId(this.opponentId).subscribe(student=>{USERS[0].name = student.name; this.refresh.next()})

    this.userService.getByStudentId(this.selfId).subscribe(student=>{USERS[1].name = student.name; this.refresh.next()})

    console.log(uuidV4());

    this.meetingScheduleService.getMeetingsByStudentId(this.opponentId).subscribe(
      meetings => {
        this.opponentEvents = meetings.map(
          (oppoM):CalendarEvent<EventMeta> => {
            let resultEvent:CalendarEvent<EventMeta> = {
              start: new Date(oppoM.start),
              end: new Date(oppoM.end),
              title: oppoM.meeting_title, //TODO: need to make some description
              id: oppoM.meeting_id,
              color: COLORS.red, //default red. will change later
              meta: {
                //https://stackoverflow.com/a/38874807
                //spread operator to do deep cloning:
                //FIX! user must be the same object reference
                user: USERS[0],
                meeting: {...oppoM}
              },
            }

            //check if opponent is my tutor and self is opponent's peer
            if (oppoM.tutor_id===this.opponentId && oppoM.peer_id===this.selfId) {
              resultEvent.color = COLORS.green;
            }
            //check if opponent is my peer and self is opponent's tutor
            if (oppoM.tutor_id===this.selfId && oppoM.peer_id===this.opponentId) {
              resultEvent.color = COLORS.blue;
            }

            return resultEvent;
          }
        )
        //another spread operator shenanigan.
        //https://stackoverflow.com/a/30846567
        this.events.push(...this.opponentEvents);
        //refresh the view
        this.refresh.next();
      },
      err => console.log(err)
    )

    this.meetingScheduleService.getMeetingsByStudentId(this.selfId).subscribe(
      meetings => {
        this.selfEvents = meetings.map(
          (selfM):CalendarEvent<EventMeta> => {
            let resultEvent:CalendarEvent<EventMeta> = {
              start: new Date(selfM.start),
              end: new Date(selfM.end),
              title: selfM.meeting_title, //TODO: need to make some description
              id: selfM.meeting_id,
              color: COLORS.yellow, //default yellow. will change later
              meta: {
                user: USERS[1],
                meeting: {...selfM}
              }
            }

            //check if opponent is my tutor and self is opponent's peer
            if (selfM.tutor_id===this.opponentId && selfM.peer_id===this.selfId) {
              resultEvent.color = COLORS.green;
            }
            //check if opponent is my peer and self is opponent's tutor
            if (selfM.tutor_id===this.selfId && selfM.peer_id===this.opponentId) {
              resultEvent.color = COLORS.blue;
            }
            return resultEvent;
          }
        )
        this.events.push(...this.selfEvents);
        //refresh the view
        this.refresh.next();
      },
      err => console.log(err)
    )

  }

  /**TODO: when user click their's own event, a modal pop up.
   * 
   * User then can either edit or cancel the meeting
   * 
   * @param action 
   * @param event 
   */
  handleEvent(action: string, event: CalendarEvent<EventMeta>): void {
    if (event.meta.meeting.peer_id === this.selfId) {
      this.openEditScheduleDialog(event);
      console.log (action+": "+JSON.stringify(event));
    }
  }

  /**when clicked on an empty hour segment, user can make meeting with tutor
   * 
   * if classname param meter exist, use that as a title
   * 
   * @param date 
   */
  hourSegmentClicked(date: Date){
    // if both opponent and self is free in those time segment
    let canSchedule = true;
    for (let e of this.events) {
      if (isWithinRange(date, e.start, subMinutes(e.end, 1))) 
      {
        canSchedule = false;
        break;  
      }
    }
    
    if (canSchedule) {
      let newMeeting = {
        "end": addMinutes(date, 30).toString(),
        "meeting_id": uuidV4(),
        "peer_id": this.selfId,
        "start": date.toString(),
        "tutor_id": this.opponentId,
        "meeting_title": this.className? this.className : "A meeting",
      }

      this.meetingScheduleService.putMeeting(newMeeting).subscribe(
        data => {
          console.log("success: " + JSON.stringify(data));
        }
      )

      let newOpponentEvent:CalendarEvent<EventMeta> = {
        start: date,
        end: addMinutes(date, 30),
        title: newMeeting.meeting_title,
        id: newMeeting.meeting_id,
        color: COLORS.green,
        meta: {
          user: USERS[0],
          meeting: {...newMeeting}
        }
      }

      let newSelfEvent:CalendarEvent<EventMeta> = {
        start: date,
        end: addMinutes(date, 30),
        title: newMeeting.meeting_title,
        id: newMeeting.meeting_id,
        color: COLORS.green,
        meta: {
          user: USERS[1],
          meeting: {...newMeeting}
        }
      }
      
      this.events.push(newOpponentEvent, newSelfEvent);

      this.refresh.next();

    }
    else {
      console.log('cannot schedule!')
    }
  }

  /**TODO: open edit class modal
   */
  openEditScheduleDialog(event:CalendarEvent<EventMeta>): void {
    let addScheduleEventInputData:AddScheduleEventInputData;

    addScheduleEventInputData = {
      start: event.start,
      end: event.end,
      title: event.title,
      hoursToConflict: 0.5 //changeLater
    }

    

    const dialogRef = this.matDialog.open(AddScheduleModalComponent, {
      width: '250px',
      data: addScheduleEventInputData,
    });

  }

  startDragToCreate(segment: DayViewHourSegment,
    mouseDownEvent: MouseEvent,
    segmentElement: HTMLElement){
    //https://mattlewis92.github.io/angular-calendar/#/drag-to-create-events
    console.log ("CLICK!!")
    console.log(JSON.stringify(segment))
  }

}
