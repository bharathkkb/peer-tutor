import { RegisterPage } from './register.po';
import { LoginPage } from './login.po';
import { element, by, browser, protractor } from 'protractor';

describe('workspace-project App', () => {
  let page: RegisterPage;
  let loginPage: LoginPage;

  beforeEach(() => {
    page = new RegisterPage();
    loginPage = new LoginPage();
  });

  it('should successfully register if studentId is not taken', () => {
    page.navigateTo();
    let uniqueReg = {
      firstname: "first1235",
      lastname: "last1235",
      studentId: "1235",
      email: "test1235@gmail.com",
      password: "password1235",
    };
    page.fillRegInfo(uniqueReg);

    //TODO: monitor if routing have problem
    loginPage.navigateTo();
    let EC = protractor.ExpectedConditions
    browser.wait(EC.presenceOf(element(by.css("input#login-username"))));

    loginPage.fillCredentials({username: uniqueReg.email, password: uniqueReg.password});

    expect(element(by.css('.content .row.mt-4')).isPresent()).toBeTruthy();
  });

  it('should fail the register if studentId has already been registered', ()=>{
    page.navigateTo();
    page.fillRegInfo();
    page.navigateTo();
    page.fillRegInfo();
    expect(page.getRegFailMsgElem().isPresent()).toBeTruthy();
  })

  it('should block out registration button if form is invalid, and show error msg. In this case, Password', ()=>{
    page.navigateTo();
    expect(page.getPasswordRequireMsgElem().isDisplayed()).toBeFalsy();
    let shortPasswordReg = {
      firstname: "first1234",
      lastname: "last1234",
      studentId: "1234",
      email: "test1234@gmail.com",
      password: "1234567",
    };
    page.fillRegInfo(shortPasswordReg);
    page.clickAwayPasswordInput();
    expect(page.getPasswordRequireMsgElem().isDisplayed()).toBeTruthy();
  })
});
