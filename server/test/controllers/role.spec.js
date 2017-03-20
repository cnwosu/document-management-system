const chai = require('chai');

const app = require('../../../server');

const request = require('supertest')(app);

const expect = chai.expect;

describe('Roles', () => {
  it('should ensure admin role exists', (done) => {
  // Admin role seeded into database wiith id of 1.
    request.get('/roles/1')
     // .set('authorization', adminToken)
      .expect(200)
      .end((err, res) => {
        expect(res.body[0].title).to.be.equal('admin');
        done();
      });
  });

  it('should ensure regular role exists', (done) => {
  // Regular role seeded into database with id of 2.
    request.get('/roles/2')
     // .set('authorization', adminToken)
      .expect(200)
      .end((err, res) => {
        expect(res.body[0].title).to.be.equal('regular');
        done();
      });
  });

   it('should not create role with no title', (done) => {
    requestHandler.post('/api/roles')
      .set('authorization', adminToken)
      .send({ title: '' })
      .expect(403)
      .end((err, res) => {
        expect(res.body.status).to.be.equal('fail');
        done();
      });
  });

  it('should return all roles', (done) => {
    requestHandler.get('/api/roles')
      .set('authorization', adminToken)
      .expect(200)
      .end((err, res) => {
        expect(res.body.status).to.be.equal('success');
        done();
      });
  });

  it('should not return all roles if not admin', (done) => {
    requestHandler.get('/api/roles')
      .set('authorization', token)
      .expect(403)
      .end((err, res) => {
        expect(res.body.status).to.be.equal('fail');
        expect(res.body.message).to.be.equal('Access denied! You don\'t have admin rights!');
        done();
      });
  });

  it('should be able to update a role', (done) => {
    requestHandler.put('/api/roles/3')
      .set('authorization', adminToken)
      .send({ title: 'document-moderator' })
      .expect(200)
      .end((err, res) => {
        expect(res.body.status).to.be.equal('success');
        done();
      });
  });

  it('should be able to delete role', (done) => {
    requestHandler.delete('/api/roles/3')
      .set('authorization', adminToken)
      .expect(200)
      .end((err, res) => {
        expect(res.body.status).to.be.equal('success');
        done();
      });
  });

  it('should fail on invalid role request', (done) => {
    requestHandler.get('/api/roles/6')
      .set('authorization', token)
      .expect(404)
      .end((err, res) => {
        expect(res.body.status).to.be.equal('fail');
        expect(res.body.message).to.be.equal('Role does not exists');
        done();
      });
  });
});
