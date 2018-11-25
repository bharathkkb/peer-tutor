import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Meeting } from '../_models'

const TEMP_HOST = "http://firen777-networklab.ddns.net:5000";

@Injectable({
  providedIn: 'root'
})
export class MeetingScheduleService {

  constructor(private http:HttpClient) { }

  putMeeting(meeting:Meeting){
    return this.http.put<Meeting>(environment.apipath.putMeeting, meeting);
  }

  getMeetingByMeetingId(id:string){
    return this.http.get<Meeting>(environment.apipath.getMeetingByMeetingId + id);
  }

  getMeetingsByPeerId(pId: string){
    return this.http.get<Meeting[]>(environment.apipath.getMeetingByPeerId + pId);
  }

  getMeetingsByStudentId(sId: string){
    return this.http.get<Meeting[]>(environment.apipath.getMeetingByStudentId + sId);
  }

  getMeetingsByTutorId(tId: string){
    return this.http.get<Meeting[]>(environment.apipath.getMeetingByTutorId + tId);
  }

}
