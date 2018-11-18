import { Component, OnInit } from '@angular/core';
import { CalendarEvent } from 'angular-calendar'

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit {

  view: string = 'day';

  viewDate: Date = new Date();

  events: CalendarEvent[] = [];

  constructor() { }

  ngOnInit() {
  }

}
