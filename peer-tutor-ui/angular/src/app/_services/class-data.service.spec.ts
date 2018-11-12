import { TestBed } from '@angular/core/testing';

import { ClassDataService } from './class-data.service';
import { HttpClientModule } from '@angular/common/http';

describe('ClassDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule,
    ]
  }));

  it('should be created', () => {
    const service: ClassDataService = TestBed.get(ClassDataService);
    expect(service).toBeTruthy();
  });
});
