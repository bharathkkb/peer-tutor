import { Component, OnInit, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { CalendarEvent, CalendarEventTimesChangedEvent, CalendarEventAction } from 'angular-calendar';
import { interval, Subject } from 'rxjs'

import { addHours, startOfDay, addDays, isWithinRange, subMinutes, addMinutes, isAfter, closestTo, differenceInMinutes } from 'date-fns';
import { ActivatedRoute } from '@angular/router';
import { DayViewHourSegment } from 'calendar-utils';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AddScheduleModalComponent, AddScheduleEventInputData, MinutesToConflictOptions, AddScheduleResult } from './add-schedule-modal/add-schedule-modal.component';
import { MeetingScheduleService, LocalStorageService, CURRENT_USER, UserService } from '../_services';

import { v4 as uuidV4} from 'uuid'
import { Meeting } from '../_models';
import { PopupMsgComponent } from '../popup-msg/popup-msg.component';

/**Color for Red, Green, Blue */
const COLORS = {
  /**Red is for event unrelated to user. No READ/WRITE allowed*/
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  /**Yellow is for event where user is the tutor. You can READ but cannot WRITE the event */
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  },
  /**Blue is for event with User as a peer. You can READ and WRITE the event*/
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  /**Green is special case of blue where the opponent is also the event tutor*/
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
  meeting: Meeting;
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

    this.populateEventViewSubRoutine()

  }

  populateEventViewSubRoutine(){

    this.events = [];

    if (this.opponentId) {
      this.meetingScheduleService.getMeetingsByStudentId(this.opponentId).subscribe(
        meetings => {
          this.opponentEvents = meetings
          .filter(
            (oppoM) => {
              let dateStart = new Date(oppoM.start);
              let dateEnd = new Date(oppoM.end);
              if (!isNaN(dateStart.getTime()) && !isNaN(dateEnd.getTime())) {
                return true;
              }
              return false;
            }
          )
          .map(
            (oppoM):CalendarEvent<EventMeta> => {
              let resultEvent:CalendarEvent<EventMeta> = {
                start: new Date(oppoM.start),
                end: new Date(oppoM.end),
                title: oppoM.meeting_title, //TODO: need to make some description
                id: oppoM.meeting_id,
                color: COLORS.red, //default red. Red means none of the user's business. Will double check later
                meta: {
                  //https://stackoverflow.com/a/38874807
                  //spread operator to do deep cloning:
                  //FIX! user must be the same object reference
                  user: USERS[0],
                  meeting: {...oppoM}
                },
              }
  
              //check if opponent is event tutor and self is event peer
              if (oppoM.tutor_id===this.opponentId && oppoM.peer_id===this.selfId) {
                resultEvent.color = COLORS.green;
              }
              //check if self is event tutor
              if (oppoM.tutor_id===this.selfId) {
                resultEvent.color = COLORS.yellow;
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
    }

    this.meetingScheduleService.getMeetingsByStudentId(this.selfId).subscribe(
      meetings => {
        this.selfEvents = meetings
        .filter(
          (selfM) => {
            let dateStart = new Date(selfM.start);
            let dateEnd = new Date(selfM.end);
            if (!isNaN(dateStart.getTime()) && !isNaN(dateEnd.getTime())) {
              return true;
            }
            return false;
          }
        )
        .map(
          (selfM):CalendarEvent<EventMeta> => {
            let resultEvent:CalendarEvent<EventMeta> = {
              start: new Date(selfM.start),
              end: new Date(selfM.end),
              title: selfM.meeting_title, //TODO: need to make some description
              id: selfM.meeting_id,
              color: COLORS.blue, //default blue. Blue means user is the peer of the event. Will double check later
              meta: {
                user: USERS[1],
                meeting: {...selfM}
              }
            }

            //check if opponent is event tutor and self is event peer
            if (selfM.tutor_id===this.opponentId && selfM.peer_id===this.selfId) {
              resultEvent.color = COLORS.green;
            }
            //check if self is event tutor
            if (selfM.tutor_id===this.selfId) {
              resultEvent.color = COLORS.yellow;
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
    }
    else if (event.meta.meeting.tutor_id === this.selfId){
      this.openEditScheduleDialog(event, true);
    }
  }

  /**when clicked on an empty hour segment, user can make meeting with tutor
   * 
   * if classname param meter exist, use that as a title
   * 
   * @param date 
   */
  hourSegmentClicked(date: Date){
    if (this.opponentId){ //Only when there is opponent. other wise no scheduling
      //TODO: MAY do Self Scheduling
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
        //make a Meeting w/ 30 min duration
        let newMeeting:Meeting = {
          "end": addMinutes(date, 30).toString(),
          "meeting_id": uuidV4(),
          "peer_id": this.selfId,
          "start": date.toString(),
          "tutor_id": this.opponentId,
          "meeting_title": this.className? this.className : "A meeting",
          "location": "",
        }
        //PUT the meeting
        this.meetingScheduleService.putMeeting(newMeeting).subscribe(
          data => {
            console.log("success: " + JSON.stringify(data));
          }
        )
  
        //new Opponent Event
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
        //same go for Self Event
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
        
        //push them both
        this.events.push(newOpponentEvent, newSelfEvent);
  
        //refresh the view
        this.refresh.next();
  
      }
      else {
        const popDialogRef:MatDialogRef<PopupMsgComponent> = this.matDialog.open(PopupMsgComponent, 
          {data: {title:'Uh Oh!', msg:'There are time conflict and you cannot schedule a meeting at this time!'}}
        )
        console.log('cannot schedule!')
      }
    }

  }

  /**
   * 
   * @param editEvent the event to be rendered and editted
   * @param readOnly are you blocked from editting or not?
   */
  openEditScheduleDialog(editEvent:CalendarEvent<EventMeta>, readOnly:boolean = false): void {
    //prepare data object for dialog input
    let addScheduleEventInputData:AddScheduleEventInputData = {
      event: editEvent,
      minutesToConflict: 30, //changeLater

      readOnly: readOnly,
      
    }

    //calculate HoursToConflict... messy type issue hack here~
    const minToConflictOpts:Array<MinutesToConflictOptions> = [30 , 60 , 90 , 120 , 150 , 180];
    let minIndex = 0;

    let concernedDateList = this.events.filter(e=>isAfter(e.start, editEvent.start)).map(e=>e.start);
    let closestConflictDate = closestTo(editEvent.start, concernedDateList);
    
    let minuteToConflict = differenceInMinutes(closestConflictDate, editEvent.start);
    while (minIndex<minToConflictOpts.length && minuteToConflict>minToConflictOpts[minIndex]){
      minIndex++;
    }
    if (minIndex>5 || concernedDateList.length===0 ) {minIndex=5;}
    
    addScheduleEventInputData.minutesToConflict = minToConflictOpts[minIndex];

    //open dialog
    const dialogRef:MatDialogRef<AddScheduleModalComponent,AddScheduleResult> = this.matDialog.open(AddScheduleModalComponent, {
      // width: '250px',
      data: addScheduleEventInputData,
    });

    dialogRef.afterClosed().subscribe(
      result=>{
        if (result.action === "edit") {
          console.log(`AFTERCLOSE: reach`)

          editEvent.meta.meeting.start = result.start.toString();
          editEvent.meta.meeting.end = result.end.toString();
          editEvent.meta.meeting.meeting_title = result.title;
          editEvent.meta.meeting.location = result.location;

          this.meetingScheduleService.putMeeting(editEvent.meta.meeting).subscribe(
            meeting=>{
              console.log(`PUT complete!`);
              this.populateEventViewSubRoutine();
            },
            err=>{console.log(err)}
          )
        }
        else if (result.action === "delete") {
          console.log(`AFTERCLOSE: reach`)

          //TODO: proper deleteion needed

          editEvent.meta.meeting.start = "DELETE";
          editEvent.meta.meeting.end = "DELETE";
          editEvent.meta.meeting.meeting_title = result.title;
          editEvent.meta.meeting.location = result.location;

          this.meetingScheduleService.putMeeting(editEvent.meta.meeting).subscribe(
            meeting=>{
              console.log(`Delete complete!`);
              this.populateEventViewSubRoutine();
            },
            err=>{console.log(err)}
          )
        }
      }
    )

  }

  /**TODO: useless?
   * 
   * @param segment 
   * @param mouseDownEvent 
   * @param segmentElement 
   */
  startDragToCreate(segment: DayViewHourSegment,
    mouseDownEvent: MouseEvent,
    segmentElement: HTMLElement){
    //https://mattlewis92.github.io/angular-calendar/#/drag-to-create-events
    console.log ("CLICK!!")
    console.log(JSON.stringify(segment))
  }

}
