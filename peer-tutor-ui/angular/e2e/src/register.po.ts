import { browser, by, element } from 'protractor';


class RegisterInfo{
  firstname: string;
  lastname: string;
  studentId: string;
  email: string;
  password: string;
  secure_question: string 
  secure_answer: string;
};

export class RegisterPage {

  private testReg:RegisterInfo = {
    firstname: "first1",
    lastname: "last1",
    studentId: "1",
    email: "test1@gmail.com",
    password: "password1",
    secure_question: "What is my pet name?",
    secure_answer: "doggy"
  };

  navigateTo() {
    return browser.get('/register');
  }

  /**try fill in reg info. Pass test1 info by default
   * 
   * @param credentias credential used to login
   */
  fillRegInfo(reg:RegisterInfo = this.testReg) {
    element(by.css('input#firstname')).sendKeys(reg.firstname);
    element(by.css('input#lastname')).sendKeys(reg.lastname);
    element(by.css('input#studentid')).sendKeys(reg.studentId);
    element(by.css('input#email')).sendKeys(reg.email);
    element(by.css('input#registerPassword')).sendKeys(reg.password);
    element(by.css('input#securequestion')).sendKeys(reg.secure_question);
    element(by.css('input#secureanswer')).sendKeys(reg.secure_answer);

    element(by.css('button.btn.btn-primary')).click();
  }

  getRegFailMsgElem() {
    return element(by.cssContainingText('.text-danger',"This user has already registered!"));
  }

  getPasswordRequireMsgElem() {
    return element(by.cssContainingText('.text-danger','Password need to be at least 8 characters long')); 
  }

  getRegistBtnElem() {
    return element(by.css('button.btn.btn-primary')); 
  }

  clickAwayPasswordInput(){
    let passwordInput = element(by.css('input#registerPassword'));
    browser.actions().mouseMove(passwordInput, {x: -20, y: -20}).click().perform();
  }

}
