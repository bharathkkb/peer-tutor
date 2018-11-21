import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { AuthenticationService } from '../_services';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http/';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

class MockAuthService extends AuthenticationService{
  login(username: string, password: string) {
    if (username=="test1@gmail.com" && password=="password1") {return of(1);} //success
    else return throwError(new Error("err"));
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [ 
        FormsModule,
        HttpClientModule,
        RouterTestingModule,
      ],
      providers: [
        {provide: AuthenticationService, useClass: MockAuthService},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check login success: "submitted" should be true, "loginError" should be false, "loginErrorMsg" should be falsy', 
    inject([AuthenticationService],(authservice:AuthenticationService)=>{
    component.loginUsername = "test1@gmail.com";
    component.loginPassword = "password1"
    component.tryLogin();
    expect(component.submitted).toBe(true);
    expect(component.loginError).toBe(false);
    expect(component.loginErrorMsg).toBeFalsy();
  }));

  it('should check login failure even username match but password not match: "submitted" should be true, "loginError" should be true, "loginErrorMsg" should be "Email or Password not matched!"', ()=>{
    component.loginUsername = "test1@gmail.com";
    component.loginPassword = "password1X"
    component.tryLogin();
    expect(component.submitted).toBe(true);
    expect(component.loginError).toBe(true);
    expect(component.loginErrorMsg).toBe("Email or Password not matched!");
  });

});
