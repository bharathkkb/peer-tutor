export interface Meeting{
  "_id"?: {
    "$oid": string;
  };
  "end": string;
  "meeting_id": string;
  "peer_id": string;
  "start": string;
  "tutor_id": string;
  "selfReserved"?: boolean;
  "meeting_title": string;
  "location": string;
  [x:string]:any;
}