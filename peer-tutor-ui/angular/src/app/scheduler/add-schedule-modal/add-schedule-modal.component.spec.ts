import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddScheduleModalComponent } from './add-schedule-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatInputModule, MatSelectModule, MatIconModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { LocalStorageService } from 'src/app/_services';

class MockLocalStorageService extends LocalStorageService {
  getCurrentUser(){
    return {"_id":{"$oid":"5bf61bb06d552f000c51df54"},"enrolled_classes":[{"_id":{"$oid":"5bf5e3cf6d552f000629f321"},"class-code":"24415","class-name":"CS 022A","dates":"01/24/19 05/13/19","days":"TR","dept-id":"d83848","dept-name":"COMPUTER SCIENCE","instructor":"N Ferguson","location":"MH 222","section":"01","students":[{"_id":{"$oid":"5bf61bb06d552f000c51df54"},"enrolled_classes":["24415"],"meetings":["{'_id': {'$oid': '5bf65c9f6d552f000c51dfa5'}, 'end': 'fdsa', 'meeting_id': 'meetingID1', 'peer_id': '1', 'selfReserved': False, 'start': 'asdfxx', 'tutor_id': '1'}","{'_id': {'$oid': '5bf65c9f6d552f000c51dfa5'}, 'end': 'fdsa', 'meeting_id': 'meetingID1', 'peer_id': '1', 'selfReserved': False, 'start': 'asdfxx', 'tutor_id': '1'}","{'_id': {'$oid': '5bf65dec6d552f000c51dfd4'}, 'end': 'fdsa', 'meeting_id': 'meetingID2', 'peer_id': '1', 'selfReserved': False, 'start': 'asdfxx', 'tutor_id': '1'}","{'_id': {'$oid': '5bf65dec6d552f000c51dfd4'}, 'end': 'fdsa', 'meeting_id': 'meetingID2', 'peer_id': '1', 'selfReserved': False, 'start': 'asdfxx', 'tutor_id': '1'}"],"name":"first1 last1","password":"password1","student_id":"1","username":"test1@gmail.com"}],"time":"1500 1615","title":"Python for Nonmjrs I","units":"3"}],"meetings":[null,null,null,null],"name":"first1 last1","password":"password1","student_id":"1","username":"test1@gmail.com"}
  }
}
const fakeCalEvent = {
  start: new Date(),
  end: new Date(),
  title: "", //TODO: need to make some description
  id: "",
  color: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  }, //default red. will change later
  meta: {
    user: {id: 1, name: ""},
    meeting: {
      "_id": {
        "$oid": "",
      },
      "end": "",
      "meeting_id": "",
      "peer_id": "",
      "start": "",
      "tutor_id": "",
      "selfReserved": true,
      "meeting_title": "",
      "location": "",
    }
  },
}

describe('AddScheduleModalComponent', () => {
  let component: AddScheduleModalComponent;
  let fixture: ComponentFixture<AddScheduleModalComponent>;

  

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddScheduleModalComponent ],
      imports:[
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        HttpClientModule,

        MatFormFieldModule,
        MatDialogModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule,
      ],
      providers: [
        {provide: MatDialogRef, useValue: {}},
        { provide: MAT_DIALOG_DATA, useValue: {event:fakeCalEvent, minutesToConflict:30, readOnly:true} },
        {provide: LocalStorageService, useClass: MockLocalStorageService,},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddScheduleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
