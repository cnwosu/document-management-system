import db from '../../models';

const expect = require('chai').expect;

const fakeDocument = {
  userId: 2,
  ownerRoleId: 7,
  title: 'First attempt',
  content: 'The first time an incident occures, it is usually tricky',
  access: 'public'
};

describe('Document model', () => {
  it('should create a new document with complete credentials', (done) => {
    expect(fakeDocument).to.include.keys([
      'userId', 'ownerRoleId', 'title', 'content', 'access'
    ]);
    expect(db.Document.bulkCreate(fakeDocument)).to.be.ok;
    done();
  });
});
