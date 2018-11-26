import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-popup-msg',
  template: `
    <h1 mat-dialog-title>{{title}}</h1>
    <div mat-dialog-content>
      <p>{{message}}</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onOkay()">Okay</button>
    </div>
  `,
  styles: []
})
export class PopupMsgComponent implements OnInit {
  title:string
  message:string

  constructor(
    public dialogRef: MatDialogRef<PopupMsgComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {title:string, msg:string}
  ) { this.title = data.title ;this.message = data.msg }

  ngOnInit() {
  }

  onOkay() {
    this.dialogRef.close();
  }

}
