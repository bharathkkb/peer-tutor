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

  /**Given number of minute, return string "? hr ? min". If less than 1 hour, return "? min" only
   * 
   * @param min 
   */
  minToHrMinString(min:number):string{
    let s = "";
    if (min<60) {
      s = `${min} min`;
    }
    else if(min%60 === 0){
      s = `${Math.floor(min/60)} hr`;
    }
    else {
      let h = Math.floor(min/60);
      let m = min%60;
      s = `${h} hr ${m} min`
    }
    return s;
  }

  /**Given a list of minute numbers, map to list of string of "? hr ? min".
   * 
   * @param minList 
   */
  minListToHrMinStringList(minList:number[]):string[]{
    return minList.map(m=>this.minToHrMinString(m));
  }
}
