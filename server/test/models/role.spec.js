import db from '../../models';

const expect = require('chai').expect;

const fakeRole = {
  title: 'roleTitle'
};
describe('Role model', () => {
  it('should create a new role with title', (done) => {
    expect(fakeRole).to.include.keys('title');
    expect(db.Roles.bulkCreate(fakeRole)).to.be.ok;
    done();
  });
});
