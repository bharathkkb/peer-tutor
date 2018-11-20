import { browser, by, element } from 'protractor';

export class LoginPage {

  private wrongCredentias = {
    username: 'wrongname',
    password: 'wrongpasswd'
  };

  navigateTo() {
    return browser.get('/login');
  }

  getLoginTitleText() {
    return element(by.css('h5.card-title')).getText();
  }

  /**try fill in credentials. Pass wrong credential by default
   * 
   * @param credentias credential used to login
   */
  fillCredentials(credentias: {username: string,password: string} = this.wrongCredentias) {
    element(by.css('input#login-username')).sendKeys(credentias.username);
    element(by.css('input#login-password')).sendKeys(credentias.password);
    element(by.css('button.btn.btn-primary')).click();
  }

  getLoginFailMsgElem() {
    return element(by.cssContainingText('.text-danger',"Email or Password not matched!"));
  }

}
