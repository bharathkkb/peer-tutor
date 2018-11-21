import { browser, by, element } from 'protractor';

export class RegisterPage {

  private wronginfo = {
    lastname: 'lastname',
    firstname: 'firstname',
    studentid: 'wrongid',
    password: 'wrongpasswd',
    email: "wrongemail",
  };

  navigateTo() {
    return browser.get('/register');
  }

  getRegisterTitleText() {
    return element(by.css('h5.card-title')).getText();
  }

  /**try fill in infos. Pass wrong infos by default
   * 
   * @param infos info used to register
   */
  fillInfos(infos: {lastname: string, firstname: string, studentid: string, password: string, email: string} = this.wronginfo) {
    element(by.css('input#lastname')).sendKeys(infos.lastname);
    element(by.css('input#firstname')).sendKeys(infos.firstname);
    element(by.css('input#registerPassword')).sendKeys(infos.password);
    element(by.css('input#studentid')).sendKeys(infos.studentid);
    element(by.css('input#email')).sendKeys(infos.email);
    element(by.css('button.btn.btn-primary')).click();
  }

  getRegisterFailMsgElem() {
    return element(by.cssContainingText('.text-danger',"Not able to register"));
  }

}
