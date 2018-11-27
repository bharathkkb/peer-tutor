import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { addMinutes, differenceInMinutes, isAfter, closestTo } from 'date-fns';
import { UserService, LocalStorageService, MeetingScheduleService } from 'src/app/_services';
import { EventMeta } from '../scheduler.component';
import { CalendarEvent } from 'calendar-utils';
import { Student } from '../../_models'

export type MinutesToConflictOptions = 30 | 60 | 90 | 120 | 150 | 180

export interface AddScheduleEventInputData {
  event: CalendarEvent<EventMeta>,
  minutesToConflict?: MinutesToConflictOptions

  readOnly: boolean;
}

export interface AddScheduleResult {
  start: Date;
  end: Date;
  title: string;
  location: string;
  action: "edit" | "noop" | "delete";
}

@Component({
  selector: 'app-add-schedule-modal',
  templateUrl: './add-schedule-modal.component.html',
  styleUrls: ['./add-schedule-modal.component.scss']
})
export class AddScheduleModalComponent implements OnInit {

  tutor_id:string = "";
  peer_id:string = "";
  concernedStartTimeList: Date[] = [];
  closestTime: Date;
  minutesToConflict: 30 | 60 | 90 | 120 | 150 | 180 = 180;

  schedulePreface: "You scheduled this meeting with tutor: " | "This meeting is scheduled by peer: " | "" = "";
  tutorpeerName:string = "";
  imPeerFlag:boolean = true;
  startTime: string = "";

  modalForm: FormGroup;

  durationOpt = [
    {v:0.5*60, t:"30m"},
    {v:1.0*60, t:"1h"},
    {v:1.5*60, t:"1h 30m"},
    {v:2.0*60, t:"2h"},
    {v:2.5*60, t:"2h 30m"},
    {v:3.0*60, t:"3h"},
  ]

  durationFilteredOpt: any[];

  ngOnInit() {
    this.peer_id = this.data.event.meta.meeting.peer_id;
    this.tutor_id = this.data.event.meta.meeting.tutor_id;

    //Prepare for the unholy callback hell because I suck at RxJS
    this.meetingScheduleService.getMeetingsByStudentId(this.peer_id).subscribe(
      peerMeetings=>{
        this.concernedStartTimeList.push(
          ...peerMeetings.map(m=>new Date(m.start))
            .filter(d=>!isNaN(d.getTime()))
            .filter(d=>isAfter(d, this.startTime))
        );
        this.meetingScheduleService.getMeetingsByStudentId(this.tutor_id).subscribe(
          tutorMeetings=>{
            this.concernedStartTimeList.push(
              ...tutorMeetings.map(m=>new Date(m.start))
                .filter(d=>!isNaN(d.getTime()))
                .filter(d=>isAfter(d, this.startTime))
            );
            let closestConflictDate = closestTo(this.startTime, this.concernedStartTimeList);
            const minToConflictOpts:Array<MinutesToConflictOptions> = [30 , 60 , 90 , 120 , 150 , 180];
            let minIndex = 0;
            let minuteToConflict = differenceInMinutes(closestConflictDate, this.startTime);
            while (minIndex<minToConflictOpts.length && minuteToConflict>minToConflictOpts[minIndex]){
              minIndex++;
            }
            if (minIndex>5 || this.concernedStartTimeList.length===0 ) {minIndex=5;}
            this.minutesToConflict = minToConflictOpts[minIndex];
            this.durationFilteredOpt = this.durationOpt.filter(opt=> opt.v<=this.minutesToConflict); //change to more updated one
          }
        );
      },
    );
    

    this.startTime = this.data.event.start.toLocaleString();
    let currUserStudentId = <Student>this.localStorageService.getCurrentUser();
    if (currUserStudentId.student_id === this.data.event.meta.meeting.peer_id){ //I am peer.
      this.schedulePreface = "You scheduled this meeting with tutor: ";
      this.userService.getByStudentId(this.data.event.meta.meeting.tutor_id).subscribe(
        student => {this.tutorpeerName = student.name;}
      )
    }
    else if (currUserStudentId.student_id === this.data.event.meta.meeting.tutor_id) { //I am tutor.
      this.schedulePreface = "This meeting is scheduled by peer: ";
      this.userService.getByStudentId(this.data.event.meta.meeting.peer_id).subscribe(
        student => {this.tutorpeerName = student.name;}
      )
    }

    // this.durationFilteredOpt = this.durationOpt.filter(opt=> opt.v<=this.data.minutesToConflict); //abandoned
    

    this.modalForm = this.formBuilder.group({
      eventTitle: this.data.event.meta.meeting.meeting_title,
      eventLocation: this.data.event.meta.meeting.location,
      eventDuration: differenceInMinutes(this.data.event.end, this.data.event.start)?differenceInMinutes(this.data.event.end, this.data.event.start):180,
    })

    if (this.data.readOnly) {
      this.modalForm.disable();
    }

  }

  constructor(
    private formBuilder: FormBuilder,
    private localStorageService:LocalStorageService,
    private userService:UserService,
    private meetingScheduleService:MeetingScheduleService,
    public dialogRef: MatDialogRef<AddScheduleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddScheduleEventInputData) {}

  onNoClick(){
    this.onActionClick("noop");
  }

  onSaveClick(){
    this.onActionClick("edit");
  }

  onDeleteClick(){
    this.onActionClick("delete");
  }

  onActionClick(action:"edit" | "noop" | "delete") {
    console.log(`Duration: ${this.modalForm.get("eventDuration").value}`)
    let result:AddScheduleResult = {
      action: action,
      start: this.data.event.start,
      end: addMinutes(this.data.event.start, this.modalForm.get("eventDuration").value),
      title: this.modalForm.get("eventTitle").value ? this.modalForm.get("eventTitle").value : "A meeting",
      location: this.modalForm.get("eventLocation").value ? this.modalForm.get("eventLocation").value : "",
    }

    this.dialogRef.close(result);
  }

}
