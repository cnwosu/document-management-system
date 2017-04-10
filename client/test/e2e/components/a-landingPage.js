describe('Landing page', () => {
  beforeEach(() => {
    browser.get('/');
  });
  console.log('************* RUNNING END TO END TESTS **************');
  it('should redirect to the login page', () => {
    const loginUrl = 'http://localhost:3000/login';
    element(by.id('landingLoginButton')).click();
    browser.sleep(1000).then(() => {
      browser.driver.getCurrentUrl().then((url) => {
        expect(url).to.equal(loginUrl);
      });
    });
  });

  it('should redirect to the signup page', () => {
    const signupUrl = 'http://localhost:3000/signup';
    element(by.id('landingSignupButton')).click();
    browser.sleep(1000).then(() => {
      browser.driver.getCurrentUrl().then((url) => {
        expect(url).to.equal(signupUrl);
      });
    });
  });
});
