describe('Login', () => {
  beforeEach(() => {
    browser.get('/login');
  });
  afterEach(() => {
    element(by.id('nav-logout-button')).click();
  });

  it('should login a registered user with correct details', () => {
    const homeUrl = 'http://localhost:3000/home';
    const email = 'admin@dms.com';
    const password = 'admin';
    element(by.id('user-email')).sendKeys(email);
    element(by.id('user-password')).sendKeys(password);
    element(by.id('login-button')).click();

    browser.sleep(2000).then(() => {
      browser.driver.getCurrentUrl().then((url) => {
        expect(url).to.equal(homeUrl);
      });
      browser.executeScript('return localStorage.getItem("token");').then((tokenAfter) => {
        expect(tokenAfter).to.not.equal(null);
      });
    });
  });
});
