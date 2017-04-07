describe('Home', () => {
  before(() => {
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

//   it('should display add new document, my documents and all documents button on homepage', () => {
//     const addDocument = element(by.id('add-documents'));
//     const myDocument = element(by.id('my-document'));
//     const allDocument = element(by.id('all-documents'));
//     addDocuments.isPresent().then((result1) => {
//         expect(result1).to.be.true;
//     });
//     myDocuments.isPresent().then((result2) => {
//         expect(result2).to.be.true;
//     });
//     allDocuments.isPresent().then((result3) => {
//         expect(result3).to.be.true;
//     });
//   });
});
