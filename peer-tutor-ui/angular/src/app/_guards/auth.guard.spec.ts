import { TestBed, async, inject } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

let mockSnapshot:any = jasmine.createSpyObj<RouterStateSnapshot>("RouterStateSnapshot", ['toString']);

describe('AuthGuard', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuard,
        {provide: RouterStateSnapshot, useValue: mockSnapshot},
      ]
    });
  });

  it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));

  it('should not be able to hit route when localStorage does not have user', 
    inject([AuthGuard], (guard: AuthGuard) => {
      localStorage.clear();
      expect(guard.canActivate(new ActivatedRouteSnapshot(), mockSnapshot)).toBe(false);
  }));

  it('should be able to hit route when localStorage have user', 
    inject([AuthGuard], (guard: AuthGuard) => {
      localStorage.setItem('currentUser', "{}");
      expect(guard.canActivate(new ActivatedRouteSnapshot(), mockSnapshot)).toBe(true);
  }));

});
