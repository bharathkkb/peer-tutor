import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddScheduleModalComponent } from './add-schedule-modal.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AddScheduleModalComponent', () => {
  let component: AddScheduleModalComponent;
  let fixture: ComponentFixture<AddScheduleModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddScheduleModalComponent ],
      imports:[
        FormsModule,
        MatFormFieldModule,
        MatDialogModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
      providers: [
        {provide: MatDialogRef, useValue: {}},
        { provide: MAT_DIALOG_DATA, useValue: {} },
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
