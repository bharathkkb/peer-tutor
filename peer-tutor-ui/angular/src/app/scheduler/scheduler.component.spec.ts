import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerComponent } from './scheduler.component';

import { CalendarModule, DateAdapter, CalendarUtils } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DayViewSchedulerCalendarUtils, DayViewSchedulerComponent } from './day-view-scheduler.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatButtonModule, MatAutocompleteModule, MatInputModule, MatFormFieldModule, MatDialogModule, MatIconModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { LocalStorageService } from '../_services';


describe('SchedulerComponent', () => {
  let component: SchedulerComponent;
  let fixture: ComponentFixture<SchedulerComponent>;

  class MockLocalStorageService extends LocalStorageService {
    getCurrentUser(){
      return {"_id":{"$oid":"5bf61bb06d552f000c51df54"},"enrolled_classes":[{"_id":{"$oid":"5bf5e3cf6d552f000629f321"},"class-code":"24415","class-name":"CS 022A","dates":"01/24/19 05/13/19","days":"TR","dept-id":"d83848","dept-name":"COMPUTER SCIENCE","instructor":"N Ferguson","location":"MH 222","section":"01","students":[{"_id":{"$oid":"5bf61bb06d552f000c51df54"},"enrolled_classes":["24415"],"meetings":["{'_id': {'$oid': '5bf65c9f6d552f000c51dfa5'}, 'end': 'fdsa', 'meeting_id': 'meetingID1', 'peer_id': '1', 'selfReserved': False, 'start': 'asdfxx', 'tutor_id': '1'}","{'_id': {'$oid': '5bf65c9f6d552f000c51dfa5'}, 'end': 'fdsa', 'meeting_id': 'meetingID1', 'peer_id': '1', 'selfReserved': False, 'start': 'asdfxx', 'tutor_id': '1'}","{'_id': {'$oid': '5bf65dec6d552f000c51dfd4'}, 'end': 'fdsa', 'meeting_id': 'meetingID2', 'peer_id': '1', 'selfReserved': False, 'start': 'asdfxx', 'tutor_id': '1'}","{'_id': {'$oid': '5bf65dec6d552f000c51dfd4'}, 'end': 'fdsa', 'meeting_id': 'meetingID2', 'peer_id': '1', 'selfReserved': False, 'start': 'asdfxx', 'tutor_id': '1'}"],"name":"first1 last1","password":"password1","student_id":"1","username":"test1@gmail.com"}],"time":"1500 1615","title":"Python for Nonmjrs I","units":"3"}],"meetings":[null,null,null,null],"name":"first1 last1","password":"password1","student_id":"1","username":"test1@gmail.com"}
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        SchedulerComponent,
        DayViewSchedulerComponent,
      ],
      imports: [
        BrowserAnimationsModule,
        CalendarModule.forRoot({
          provide: DateAdapter,
          useFactory: adapterFactory
        }),
        RouterTestingModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        HttpClientModule,
      ],
      providers: [
        {
          provide: LocalStorageService,
          useClass: MockLocalStorageService,
        },
      //   {
      //     provide: CalendarUtils,
      //     useClass: DayViewSchedulerCalendarUtils
      //   },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(SchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();


  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
