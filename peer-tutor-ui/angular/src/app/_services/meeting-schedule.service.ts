import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface MeetingObjType {
  "end": string;
  "meeting_id": string;
  "peer_id": string;
  "start": string;
  "tutor_id": string;
  "selfReserved"?: boolean;
  "_id"?: any;
  "title"?: string;
  [x:string]:any;
}

const TEMP_HOST = "http://firen777-networklab.ddns.net:5000";

@Injectable({
  providedIn: 'root'
})
export class MeetingScheduleService {

  constructor(private http:HttpClient) { }

  putMeeting(meeting:MeetingObjType){
    return this.http.put<MeetingObjType>(environment.apipath.putMeeting, meeting);
  }

  getMeetingByMeetingId(id:string){
    return this.http.get<MeetingObjType>(environment.apipath.getMeetingByMeetingId + id);
  }

  getMeetingsByPeerId(pId: string){
    return this.http.get<MeetingObjType[]>(environment.apipath.getMeetingByPeerId + pId);
  }

  getMeetingsByStudentId(sId: string){
    return this.http.get<MeetingObjType[]>(environment.apipath.getMeetingByStudentId + sId);
  }

  getMeetingsByTutorId(tId: string){
    return this.http.get<MeetingObjType[]>(environment.apipath.getMeetingByTutorId + tId);
  }

}
