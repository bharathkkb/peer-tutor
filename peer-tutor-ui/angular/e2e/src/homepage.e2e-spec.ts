import { HomePage } from './homepage.po';

describe('workspace-project App', () => {
  let page: HomePage;

  beforeEach(() => {
    page = new HomePage();
  });

  it('should see the home page once login', () => {
    page.login();
    expect(page.getHomePageElem().isPresent()).toBeTruthy();
  });

  
  it('should show the modal once click add class button', ()=>{
    page.login();
    page.getAddClassBtnElem().click();
    expect(page.getAddClassModalElem().isPresent()).toBeTruthy();
  })
  
});
