import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-add-schedule-modal',
  templateUrl: './add-schedule-modal.component.html',
  styleUrls: ['./add-schedule-modal.component.scss']
})
export class AddScheduleModalComponent implements OnInit {

  ngOnInit() {
  }

  constructor(
    public dialogRef: MatDialogRef<AddScheduleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
