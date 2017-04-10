describe('Home', () => {
  beforeEach(() => {
    browser.get('/login');
  });

  it('should display all documents on homepage', () => {
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

  it('should create a new document', () => {
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
      element(by.id('add-documents')).click();
      const newDocumentModal = element(by.id('modal1'));
      // Ensure new document modal is displayed
      newDocumentModal.isPresent().then((result) => {
        expect(result).to.be.true;
      });

      // Create new document
      const title = 'New e2e test document';
      const content = 'e2e document test spec library content';
      const access = 'private';
      const saveButton = element(by.id('saveNewDocumentModal'));
      element(by.id('document_title')).sendKeys(title);
      element(by.id('document_content')).sendKeys(content);
      saveButton.click();
    });
  });

  it('should not list all users if current user is not an admin', () => {
    const homeUrl = 'http://localhost:3000/home';
    const regularEmail = 'regular@dms.com';
    const regularPassword = 'regular';
    element(by.id('user-email')).sendKeys(regularEmail);
    element(by.id('user-password')).sendKeys(regularPassword);
    element(by.id('login-button')).click();

    browser.sleep(2000).then(() => {
      browser.driver.getCurrentUrl().then((url) => {
        expect(url).to.equal(homeUrl);
      });
    });
    const allUsersTab = element(by.id('all-users-tab'));
    allUsersTab.isPresent().then((result) => {
      expect(result).to.be.false;
    });
  });

  it('should list all users if current user is an admin', () => {
    const homeUrl = 'http://localhost:3000/home';
    const adminEmail = 'admin@dms.com';
    const adminPassword = 'admin';
    element(by.id('user-email')).sendKeys(adminEmail);
    element(by.id('user-password')).sendKeys(adminPassword);
    element(by.id('login-button')).click();

    browser.sleep(2000).then(() => {
      browser.driver.getCurrentUrl().then((url) => {
        expect(url).to.equal(homeUrl);
      });
    });
    const allUsersTab = element(by.id('all-users-tab'));
    allUsersTab.isPresent().then((result) => {
      expect(result).to.be.true;
    });
  });
});
