import { TestBed } from '@angular/core/testing';

import { LocalStorageService } from './local-storage.service';
import { HttpClientModule } from '@angular/common/http';

describe('LocalStorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({imports: [
    HttpClientModule,
  ]}));

  it('should be created', () => {
    const service: LocalStorageService = TestBed.get(LocalStorageService);
    expect(service).toBeTruthy();
  });
});
