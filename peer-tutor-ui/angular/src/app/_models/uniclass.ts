/**Example for a UniClass instance:
 * 
 * ```
 * {
  "_id": {
    "$oid": "5bf5e3d16d552f00062a0377"
  },
  "class-code": "22371",
  "class-name": "STAT 115",
  "dates": "01/24/19 05/13/19",
  "days": "TR",
  "dept-id": "d83918",
  "dept-name": "STATISTICS",
  "instructor": "D Schuster",
  "location": "DMH 359",
  "section": "03",
  "students": ["012345678",...]
  "time": "1030 1145",
  "title": "Interm Stat",
  "units": "3"
}
 * ```
 */
export class UniClass{
    "_id": any;
    "dept-name": string;
    "dept-id": string;
    "class-name": string;
    "class-code": string;
    "dates": string;
    "days": string;
    "instructor": string;
    "location": string;
    "time": string;
    "title": string;
    "units": string;
    "section": string;
    "students": string[]
}

/**
 * Sumary of a UniClass
 */
export class UniClassSum {
    "_id": string;
    "class-name": string;
    "class-code": string;
    "start-dates": string;
    "end-dates": string;
    "days": string;
    "instructor": string;
    "location": string;
    "start-time": string;
    "end-time": string;
    "title": string;
    "section": string;
  }