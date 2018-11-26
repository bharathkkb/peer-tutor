import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'
import { Rating } from '../_models'

@Injectable({
  providedIn: 'root'
})
export class RatingDataService {

  constructor(private http: HttpClient) { }

  putRating(r: Rating) {
    return this.http.put<Rating>(environment.apipath.putRating, r);
  }

  getRatingAvgByStudentId(id: string) {
    return this.http.get<Rating>(environment.apipath.getRatingAvgByStudentId + id);
  }

  getRatingsByGivenStudentId(id: string) {
    return this.http.get<Rating[]>(environment.apipath.getRatingsByGivenStudentId + id);
  }

  getRatingByRatingId(rId: string) {
    return this.http.get<Rating>(environment.apipath.getRatingByRatingId + rId);
  }

  getRatingsByReceivedStudentId(id: string) {
    return this.http.get<Rating[]>(environment.apipath.getRatingsByReceivedStudentId + id);
  }

}
