import { Injectable } from '@angular/core';
import { addMinutes, isBefore } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class SchedulingHelperService {

  constructor() { }

  /**given start, end time, return a list of Date in b/w start and end, as well as a list of elapsed minutes.
   * 
   * noted that start is excluded while end is included
   * 
   * @param start the starting time, exclusive
   * @param end the ending time, inclusive
   * @param stepMin default 30 min a splice
   */
  timeSplicing(start:Date, end:Date, stepMin:number=30):{dateList: Date[], minList: number[]}{
    let dArr: Date[] = [];
    let mArr: number[] = [];

    let min = stepMin;
    while(isBefore(addMinutes(start, min-1), end)) {
      dArr.push(addMinutes(start, min));
      mArr.push(min);

      min += stepMin;
    }

    return {dateList: dArr, minList: mArr};
  }

  

}
