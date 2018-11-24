import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

export interface AddScheduleEventInputData {
  start: Date;
  end?: Date;
  hoursToConflict: 0.5 | 1.0 | 1.5 | 2.0 | 2.5 | 3.0;
  title: string;
}

export interface AddScheduleResult {
  start: Date;
  end: Date;
  title: string;
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
    {v:0.5, t:"30m"},
    {v:1.0, t:"1h"},
    {v:1.5, t:"1h 30m"},
    {v:2.0, t:"2h"},
    {v:2.5, t:"2h 30m"},
    {v:3.0, t:"3h"},
  ]

  durationFilteredOpt: any[];

  ngOnInit() {
    this.startTime = this.data.start.toLocaleString();

    this.durationFilteredOpt = this.durationOpt.filter(opt=> opt.v<=this.data.hoursToConflict);

    this.modalForm = this.formBuilder.group({
      eventTitle: this.data.title,
      eventDuration: 0.5,
    })
  }

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddScheduleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddScheduleEventInputData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick() {

  }

}
