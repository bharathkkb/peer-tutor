import { TestBed } from '@angular/core/testing';

import { SchedulingHelperService } from './scheduling-helper.service';
import { startOfDay, addMinutes } from 'date-fns';

describe('SchedulingHelperService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SchedulingHelperService = TestBed.get(SchedulingHelperService);
    expect(service).toBeTruthy();
  });

  it('should return end date', () => {
    const service: SchedulingHelperService = TestBed.get(SchedulingHelperService);

    let dStart = addMinutes(startOfDay(new Date()), 150);
    let dEnd = addMinutes(startOfDay(new Date()), 180);

    let ans = service.timeSplicing(dStart, dEnd);
    expect(ans.dateList.length).toBe(1);
    expect(ans.dateList[0].toString()).toBe(dEnd.toString());
    expect(ans.minList.length).toBe(1);
    expect(ans.minList[0]).toBe(30);

  })

  it('should return sensible date list', () => {
    const service: SchedulingHelperService = TestBed.get(SchedulingHelperService);

    let dStart = addMinutes(startOfDay(new Date()), 21*60);
    let dEnd = addMinutes(startOfDay(new Date()), 21*60+ 10*2*30 + 30); //21 half hour later

    let dArr = [
      addMinutes(startOfDay(new Date()), 21*60+1*30).toString(),
      addMinutes(startOfDay(new Date()), 21*60+2*30).toString(),
      addMinutes(startOfDay(new Date()), 21*60+3*30).toString(),
      addMinutes(startOfDay(new Date()), 21*60+4*30).toString(),
      addMinutes(startOfDay(new Date()), 21*60+5*30).toString(),
      addMinutes(startOfDay(new Date()), 21*60+6*30).toString(),
      addMinutes(startOfDay(new Date()), 21*60+7*30).toString(),
      addMinutes(startOfDay(new Date()), 21*60+8*30).toString(),
      addMinutes(startOfDay(new Date()), 21*60+9*30).toString(),
      addMinutes(startOfDay(new Date()), 21*60+10*30).toString(),
      addMinutes(startOfDay(new Date()), 21*60+11*30).toString(),
      addMinutes(startOfDay(new Date()), 21*60+12*30).toString(),
      addMinutes(startOfDay(new Date()), 21*60+13*30).toString(),
      addMinutes(startOfDay(new Date()), 21*60+14*30).toString(),
      addMinutes(startOfDay(new Date()), 21*60+15*30).toString(),
      addMinutes(startOfDay(new Date()), 21*60+16*30).toString(),
      addMinutes(startOfDay(new Date()), 21*60+17*30).toString(),
      addMinutes(startOfDay(new Date()), 21*60+18*30).toString(),
      addMinutes(startOfDay(new Date()), 21*60+19*30).toString(),
      addMinutes(startOfDay(new Date()), 21*60+20*30).toString(),
      addMinutes(startOfDay(new Date()), 21*60+21*30).toString(),
    ]

    let mArr = [
      1*30,
      2*30,
      3*30,
      4*30,
      5*30,
      6*30,
      7*30,
      8*30,
      9*30,
      10*30,
      11*30,
      12*30,
      13*30,
      14*30,
      15*30,
      16*30,
      17*30,
      18*30,
      19*30,
      20*30,
      21*30,
    ]


    let ans = service.timeSplicing(dStart, dEnd);
    expect(ans.dateList.length).toBe(21);
    expect(ans.dateList.map(d=>d.toString())).toEqual(dArr);
    expect(ans.minList.length).toBe(21);
    expect(ans.minList).toEqual(mArr);

  })

});
