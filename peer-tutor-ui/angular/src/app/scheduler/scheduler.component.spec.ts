import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerComponent } from './scheduler.component';

import { CalendarModule, DateAdapter, CalendarUtils } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DayViewSchedulerCalendarUtils, DayViewSchedulerComponent } from './day-view-scheduler.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatButtonModule, MatAutocompleteModule, MatInputModule, MatFormFieldModule, MatDialogModule, MatIconModule } from '@angular/material';


describe('SchedulerComponent', () => {
  let component: SchedulerComponent;
  let fixture: ComponentFixture<SchedulerComponent>;

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
      ],
      providers: [
        
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
