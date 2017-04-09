import faker from 'faker';

describe('Signup', () => {
  beforeEach(() => {
    browser.get('/signup');
  });
  afterEach(() => {
    element(by.id('logout-button')).click();
  });

  it('should signup a user with valid details', () => {
    browser.executeScript('return localStorage.getItem("token");').then((tokenBefore) => {
      expect(tokenBefore).to.equal(null);
    });
    const homeUrl = 'http://localhost:3000/home';
    const email = faker.internet.email();
    const password = '123456';
    const username = faker.internet.userName();
    const fullname = `${faker.name.firstName()} ${faker.name.lastName()}`;
    const passwordConfirmation = '123456';
    element(by.id('user-email')).sendKeys(email);
    element(by.id('user-password')).sendKeys(password);
    element(by.id('password_confirmation')).sendKeys(passwordConfirmation);
    element(by.id('username')).sendKeys(username);
    element(by.id('fullname')).sendKeys(fullname);
    element(by.id('signup_button')).click();

    browser.sleep(3000).then(() => {
      browser.driver.getCurrentUrl().then((url) => {
        expect(url).to.equal(homeUrl);
      });
      browser.executeScript('return localStorage.getItem("token");').then((tokenAfter) => {
        expect(tokenAfter).to.not.equal(null);
      });
    });
  });
});
