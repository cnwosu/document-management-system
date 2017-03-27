import bcrypt from 'bcrypt-nodejs';
import db from '../../models';

const expect = require('chai').expect;

const fakeUser = {
  fullname: 'Amaka Nwosu',
  username: 'amakan',
  email: 'amaka@yahoo.com',
  password: '1234567',
  password_digest: bcrypt.hashSync('1234567'),
  roleId: 2

};
describe('User model', () => {
  it('should create a new user with complete credentials', (done) => {
    expect(fakeUser).to.include.keys([
      'fullname', 'username', 'email', 'password', 'roleId'
    ]);
    expect(db.User.bulkCreate(fakeUser)).to.be.ok;
    done();
  });
});
