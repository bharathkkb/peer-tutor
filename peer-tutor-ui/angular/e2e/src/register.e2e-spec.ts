import { RegisterPage } from './register.po';

describe('workspace-project App', () => {
  let page: RegisterPage;

  beforeEach(() => {
    page = new RegisterPage();
  });

  it('should display "Register" as title', () => {
    page.navigateTo();
    expect(page.getRegisterTitleText()).toEqual('Register');
  });

  it('should fail the register', ()=>{
    page.navigateTo();
    page.fillInfos();
    expect(page.getRegisterFailMsgElem().isPresent()).toBeTruthy();
  })
});
