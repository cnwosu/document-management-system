const expect = require('chai').expect;
const request = require('supertest');
const server = require('../../../server');

describe('Authentication', () => {
  describe('User token', () => {
    it('should return unauthorised if no user token is specified', (done) => {
      request(server).get('/api/users/1').expect(401)
        .then((res) => {
          expect(res.body.message).to.equal('User unauthorized');
          done();
        });
    });

    it('should return unauthorised if user token is not correct', (done) => {
      request(server).get('/api/users/1')
      .set('Authorization', 'Authorization').expect(401)
        .then((res) => {
          expect(res.body.message).to.equal('User unauthorized');
          done();
        });
    });

    it('should return unauthorised if no admin token is specified', (done) => {
      request(server).get('/api/users/1').expect(401)
        .then((res) => {
          expect(res.body.message).to.equal('User unauthorized');
          done();
        });
    });

    it('should return unauthorised if admin token is not correct', (done) => {
      request(server).get('/api/users/1')
      .set('Authorization', 'Authorization').expect(401)
        .then((res) => {
          expect(res.body.message).to.equal('User unauthorized');
          done();
        });
    });
  });
});
