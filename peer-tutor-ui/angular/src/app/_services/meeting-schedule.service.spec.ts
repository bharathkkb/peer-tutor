import { TestBed } from '@angular/core/testing';

import { MeetingScheduleService } from './meeting-schedule.service';
import { HttpClientModule } from '@angular/common/http';

describe('MeetingScheduleService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule,
    ]
  }));

  it('should be created', () => {
    const service: MeetingScheduleService = TestBed.get(MeetingScheduleService);
    expect(service).toBeTruthy();
  });
});
