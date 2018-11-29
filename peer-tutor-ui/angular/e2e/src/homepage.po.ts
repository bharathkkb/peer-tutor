import { browser, by, element } from 'protractor';

export class HomePage {

  navigateTo() {
    return browser.get('/');
  }

  /**Return add class floating button as element
   */
  getAddClassBtnElem(){
    return element(by.css('.mat-button-bottom-right-fixed'));
  }

  /**Return add class modal as element
   */
  getAddClassModalElem(){
    return element(by.css('#myModal'));
  }

  /**Return the biggest chunk of background as homepage element */
  getHomePageElem(){
    return element(by.css('.content .row.mt-4'));
  }

  /**Just brute force login into homepage. dont care the rest
   */
  login(){
    browser.get('/register');
    element(by.css('input#firstname')).sendKeys("firstXX");
    element(by.css('input#lastname')).sendKeys("lastXX");
    element(by.css('input#studentid')).sendKeys("123456789");
    element(by.css('input#email')).sendKeys("testX@gmail.com");
    element(by.css('input#registerPassword')).sendKeys("passwordX");
    element(by.css('input#securequestion')).sendKeys("XXX");
    element(by.css('input#secureanswer')).sendKeys("XXX");

    element(by.css('button.btn.btn-primary')).click();
    browser.get('/login');
    element(by.css('input#login-username')).sendKeys("testX@gmail.com");
    element(by.css('input#login-password')).sendKeys("passwordX");
    element(by.css('button.btn.btn-primary')).click();
    //browser.get('/');
  }

  

}
