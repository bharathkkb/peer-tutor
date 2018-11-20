import { LoginPage } from './login.po';

describe('workspace-project App', () => {
  let page: LoginPage;

  beforeEach(() => {
    page = new LoginPage();
  });

  it('should display "Login" as title', () => {
    page.navigateTo();
    expect(page.getLoginTitleText()).toEqual('Login');
  });

  it('should fail the login', ()=>{
    page.navigateTo();
    page.fillCredentials();
    expect(page.getLoginFailMsgElem().isPresent()).toBeTruthy();
  })
});
