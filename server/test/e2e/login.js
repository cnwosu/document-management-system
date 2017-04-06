describe('Login', () => {
  beforeEach(() => {
    browser.get('/auth/login');
  });

  it('should have correct title', () => {
    expect(browser.getTitle()).to.eventually.equal('Login');
  });
});
