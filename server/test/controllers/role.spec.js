const chai = require('chai');

const app = require('../../../server');

const request = require('supertest')(app);

const expect = chai.expect;

describe('Roles', () => {
  let adminToken;
  let regularToken;
  before((done) => {
    request.post('/api/users/login')
      .send({ email: 'admin@dms.com', password: 'admin' })
        .then((res) => {
          adminToken = res.body.jwt;
          request.post('/api/users/login')
            .send({ email: 'regular@dms.com', password: 'regular' })
              .then((response) => {
                regularToken = response.body.jwt;
                done();
              });
        });
  });

  it('should create a role if requested by admin', (done) => {
    request.post('/api/roles')
      .set('authorization', adminToken)
      .send({ title: 'special' })
      .expect(201)
      .then((res) => {
        expect(res.body.title).to.equal('special');
        done();
      });
  });

  it('should not create a role if already created', (done) => {
    request.post('/api/roles')
      .set('authorization', regularToken)
      .send({ title: 'newRole' })
      .expect(401)
      .then((res) => {
        expect(res.body.message).to.equal('Only an admin can perform this action');
        done();
      });
  });

  it('should not create a role if not requested by admin', (done) => {
    request.post('/api/roles')
      .set('authorization', adminToken)
      .send({ title: 'existingRole' })
      .expect(201)
      .then(() => {
        request.post('/api/roles')
          .set('authorization', adminToken)
            .send({ title: 'existingRole' })
              .expect(409)
              .then((response) => {
                expect(response.body.message).to.equal('Role already exist');
                done();
              });
      });
  });

  it('should ensure admin role exists', (done) => {
  // Admin role seeded into database wiith id of 1.
    request.get('/api/roles/1')
      .set('authorization', adminToken)
      .expect(200)
      .then((res) => {
        expect(res.body[0].title).to.equal('admin');
        done();
      });
  });

  it('should ensure regular role exists', (done) => {
  // Regular role seeded into database with id of 2.
    request.get('/api/roles/2')
      .set('authorization', adminToken)
      .expect(200)
      .then((res) => {
        expect(res.body[0].title).to.equal('regular');
        done();
      });
  });

  it('should not create role with no title', (done) => {
    request.post('/api/roles')
      .set('authorization', adminToken)
      .send({ title: '' })
      .expect(400)
      .then((res) => {
        expect(res.body.message).to.equal('Specify role title');
        done();
      });
  });

  it('should return all roles', (done) => {
    request.get('/api/roles')
      .set('authorization', adminToken)
      .expect(200)
      .then(() => {
        done();
      });
  });

  it('should not return all roles if not admin', (done) => {
    request.get('/api/roles')
      .set('authorization', regularToken)
      .expect(401)
      .then((res) => {
        expect(res.body.message).to.equal('User unauthorized');
        done();
      });
  });

  it('should update a role if requested by admin', (done) => {
    request.put('/api/roles/2')
      .set('authorization', adminToken)
      .send({ title: 'document-moderator' })
      .expect(200)
      .then((res) => {
        expect(res.body.message).to.equal('Role Updated!');
        done();
      });
  });

  it('should not update a role if not requested by admin', (done) => {
    request.put('/api/roles/2')
      .set('authorization', regularToken)
      .send({ title: 'document-moderator' })
      .expect(401)
      .then((res) => {
        expect(res.body.message).to.equal('Only an admin can perform this action');
        done();
      });
  });

  it('should not delete role if not requested by admin', (done) => {
    request.delete('/api/roles/2')
      .set('authorization', regularToken)
      .expect(401)
      .then((res) => {
        expect(res.body.message).to.equal('Only an admin can perform this action');
        done();
      });
  });

  it('should delete role if requested by admin', (done) => {
    request.delete('/api/roles/2')
      .set('authorization', adminToken)
      .expect(200)
      .then((res) => {
        expect(res.body.message).to.equal('Role successfully deleted');
        done();
      });
  });


  it('should fail for a non-exsistent role request', (done) => {
    request.get('/api/roles/609876')
      .set('authorization', adminToken)
      .expect(404)
      .then((res) => {
        expect(res.body.message).to.equal('Role does not exists');
        done();
      });
  });
});
