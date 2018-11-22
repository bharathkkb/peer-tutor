import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface MeetingInput {
  "end": string;
  "meeting_id": string;
  "peer_id": string;
  "start": string;
  "tutor_id": string;
}

const TEMP_HOST = "http://firen777-networklab.ddns.net:5000";

@Injectable({
  providedIn: 'root'
})
export class MeetingScheduleService {

  constructor(private http:HttpClient) { }

  putMeeting(meeting:MeetingInput){
    return this.http.put(TEMP_HOST + "/", {});
  }

  
}
