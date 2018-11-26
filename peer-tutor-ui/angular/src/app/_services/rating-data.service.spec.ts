import { TestBed } from '@angular/core/testing';

import { RatingDataService } from './rating-data.service';
import { HttpClientModule } from '@angular/common/http';

describe('RatingDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule,
    ]
  }));

  it('should be created', () => {
    const service: RatingDataService = TestBed.get(RatingDataService);
    expect(service).toBeTruthy();
  });
});
