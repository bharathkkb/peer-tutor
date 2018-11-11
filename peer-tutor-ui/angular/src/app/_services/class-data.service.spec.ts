import { TestBed } from '@angular/core/testing';

import { ClassDataService } from './class-data.service';

describe('ClassDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClassDataService = TestBed.get(ClassDataService);
    expect(service).toBeTruthy();
  });
});
