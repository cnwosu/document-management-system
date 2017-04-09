describe('Home', () => {
  beforeEach(() => {
    browser.get('/login');
  });
  after(() => {
    element(by.id('logout-button')).click();
  });

  it('should display all documents on homepage', () => {
    browser.executeScript('return localStorage.getItem("token");').then((tokenBefore) => {
      expect(tokenBefore).to.equal(null);
    });
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
    const allDocuments = element(by.id('all-documents'));
    allDocuments.isPresent().then((result) => {
        expect(result).to.be.true;
    });
  });
});
