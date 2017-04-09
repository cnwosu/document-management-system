const chai = require('chai');

const app = require('../../../server');

const request = require('supertest')(app);

const expect = chai.expect;

const regularUser = {
  fullname: 'Amaka',
  username: 'Nwosu',
  email: 'amaka@gmail.com',
  password: '123456',
  roleId: 2
};

const adminUser =
  {
    fullname: 'Kem',
    username: 'Jobs',
    email: 'kem@gmail.com',
    password: '123456',
    roleId: 1
  };

let regularToken = '';
let adminToken = '';
let createdRegularUser;

describe('User', () => {
  it('should create a user', (done) => {
    // Create regular user
    request.post('/api/users')
      .send(regularUser)
      .expect(201)
      .then((res) => {
        expect(res.body.userData.email).to.equal(regularUser.email);
        regularToken = res.body.token;
        createdRegularUser = res.body.userData;

        // Create admin user
        request.post('/api/users')
          .send(adminUser)
          .expect(201)
          .then((response) => {
            expect(response.body.userData.email).to.equal(adminUser.email);
            adminToken = response.body.token;
            done();
          });
      });
  });

  it('should create a unique user', (done) => {
    request.post('/api/users')
      .send(regularUser)
      .expect(409)
      .then((res) => {
        expect(res.body.message).to.equal('User already exists');
        done();
      });
  });

  it('should not create a user with incomplete details', (done) => {
    request.post('/api/users')
      .send({
        fullname: 'Gregory',
        username: 'George',
        password: '123456',
      })
      .expect(400)
      .then((res) => {
        expect(res.body.message).to.equal('Incomplete details');
        done();
      });
  });

  it('should not create a user with invalid details', (done) => {
    request.post('/api/users')
      .send({
        fullname: 'Gregory',
        username: '   ',
        email: 'gregory@gmail.com',
        password: '123456',
        roleId: 1,
      })
      .expect(400)
      .then((res) => {
        expect(res.body.message).to.equal('Invalid details');
        done();
      });
  });

  it('should ensure the new user has role defined', (done) => {
    request.get(`/api/users/${createdRegularUser.id}`)
    .set('authorization', regularToken)
      .expect(200)
      .then((res) => {
        expect(res.body.user.roleId).to.not.be.undefined;
        done();
      });
  });

  it('should expect that new user has both fullname and username', (done) => {
    request.get(`/api/users/${createdRegularUser.id}`)
      .set('authorization', regularToken)
      .expect(200)
      .then((res) => {
        expect(res.body.user.fullname).to.not.be.undefined;
        expect(res.body.user.username).to.not.be.undefined;
        done();
      });
  });

  it('should be able to update user details', (done) => {
    request.put(`/api/users/${createdRegularUser.id}`)
      .set('authorization', regularToken)
      .expect(200)
      .send({
        fullname: 'wozniak kolinski',
      })
      .then((res) => {
        expect(res.body.message).to.equal('User details Updated');
        done();
      });
  });

  it('should not be able to update other users details', (done) => {
    request.put('/api/users/1')
      .set('authorization', regularToken)
      .expect(401)
      .send({
        lastname: 'wozniak',
      })
      .then((res) => {
        expect(res.body.message).to.equal('User Unauthorised');
        done();
      });
  });

  it('should return all users requested by admin', (done) => {
    request.get('/api/users')
        .set('authorization', adminToken)
        .expect(200)
        .then(() => {
          done();
        });
  });

  it('should not return all users if requested by regular user', (done) => {
    request.get('/api/users')
        .set('authorization', regularToken)
        .expect(401)
        .then((res) => {
          expect(res.body.message).to.equal('Only an admin can perform this action');
          done();
        });
  });

  it('should login a registered user', (done) => {
    request.post('/api/users/login')
      .send({
        email: 'regular@dms.com',
        password: 'regular',
      })
      .expect(200)
      .then((res) => {
        expect(res.body.message).to.equal('success');
        done();
      });
  });

  it('should not login with invalid credentials', (done) => {
    request.post('/api/users/login')
      .send({
        email: 'non-existent-user@gmail.com',
        password: '654321',
      })
      .expect(401)
      .then((res) => {
        expect(res.body.message).to.be.equal('Login failed');
        done();
      });
  });

  it('should be able to get a user', (done) => {
    request.get(`/api/users/${createdRegularUser.id}`)
      .set('authorization', regularToken)
      .expect(200)
      .then((res) => {
        expect(res.body.user.username).to.equal(createdRegularUser.username);
        done();
      });
  });

  it('should not be able to delete another user', (done) => {
    request.delete('/api/users/1')
      .set('authorization', regularToken)
      .expect(401)
      .then((res) => {
        expect(res.body.message).to.equal('User Unauthorised');
        done();
      });
  });

  it('should be able to delete a user', (done) => {
    request.delete(`/api/users/${createdRegularUser.id}`)
        .set('authorization', regularToken)
        .expect(204)
        .then((response) => {
          expect(response.ok).to.be.true;
          done();
        });
  });

  it('should logout a user', (done) => {
    request.post('/api/users/logout')
        .expect(200)
        .then((response) => {
          expect(response.body.message).to.equal('Logout successfull');
          done();
        });
  });
});
