import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { addHours, addMinutes } from 'date-fns';

export type MinutesToConflictOptions = 30 | 60 | 90 | 120 | 150 | 180

export interface AddScheduleEventInputData {
  start: Date;
  end?: Date;
  minutesToConflict: MinutesToConflictOptions
  title: string;
  location: string;
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

  startTime: string;

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
    this.startTime = this.data.start.toLocaleString();

    this.durationFilteredOpt = this.durationOpt.filter(opt=> opt.v<=this.data.minutesToConflict);
    console.log("Filtered_FLAG: "+ this.data.minutesToConflict)
    console.log("Filtered_FLAG: "+JSON.stringify(this.durationFilteredOpt))

    this.modalForm = this.formBuilder.group({
      eventTitle: this.data.title,
      eventLocation: this.data.location,
      eventDuration: 30,
    })

  }

  constructor(
    private formBuilder: FormBuilder,
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
      start: this.data.start,
      end: addMinutes(this.data.start, this.modalForm.get("eventDuration").value),
      title: this.modalForm.get("eventTitle").value ? this.modalForm.get("eventTitle").value : "A meeting",
      location: this.modalForm.get("eventLocation").value ? this.modalForm.get("eventLocation").value : "",
    }

    this.dialogRef.close(result);
  }

}
