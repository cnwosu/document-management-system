const chai = require('chai');

const app = require('../../../server');

const request = require('supertest')(app);

const expect = chai.expect;

describe('Document', () => {
  let adminToken;
  let regularToken;
  let documentCreated;
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

  it('should be able to create document', (done) => {
    request.post('/api/documents')
      .set('authorization', adminToken)
      .send({
        title: 'My document',
        content: 'This is a cool document',
        userId: 1,
        access: 'public'
      })
      .expect(201)
      .then((res) => {
        documentCreated = res.body;
        done();
      });
  });

  it('should be able to get own documents', (done) => {
    request.get(`/api/documents/${documentCreated.id}`)
      .set('authorization', adminToken)
      .expect(200)
      .then(() => {
        done();
      });
  });

  it('should not be able to get documents not created by user', (done) => {
    request.get(`/api/documents/${documentCreated.id}`)
      .set('authorization', regularToken)
      .expect(200)
      .then(() => {
        done();
      });
  });

  it('should ensure document has property set to public by default', () => {
    expect(documentCreated.access).to.be.equal('public');
  });

  it('should ensure only the creator can access private document', (done) => {
    request.post('/api/users/login')
      .accept('Accept', 'application/json')
      .send({
        email: 'mike@mail.com',
        password: 'mike',
      })
      .expect(200)
      .end((err, res) => {
        const genToken = res.body.data.token;
        request.get('/api/documents/3')
          .set('authorization', genToken)
          .expect(403)
          .end((err2, res2) => {
            expect(res2.body.status).to.be.equal('fail');
            expect(res2.body.message).to.be.equal(
              'You do not have permissions to view this document');

            request.get('/api/documents/4')
              .set('authorization', genToken)
              .expect(200)
              .end((err3, res3) => {
                expect(res3.body.status).to.be.equal('success');
                expect(res3.body.message).to.be.equal('Document info loaded');
                done();
              });
          });
      });
  });

  it('should ensure document created has published date defined', () => {
    expect(typeof documentCreated.createdAt).to.not.equal('undefined');
  });

  it('should get all documents', (done) => {
    request.get('/api/documents')
      .set('authorization', adminToken)
      .expect(200)
      .end((err, res) => {
        expect(res.body.status).to.be.equal('success');
        expect(res.body.message).to.be.equal('Documents listed');
        expect(res.body.data.length).to.be.equal(6);
        done();
      });
  });

  it('should get limited documents', (done) => {
    request.get('/api/documents?limit=2')
      .set('authorization', adminToken)
      .expect(200)
      .end((err, res) => {
        expect(res.body.status).to.be.equal('success');
        expect(res.body.message).to.be.equal('Documents listed');
        expect(res.body.data.length).to.be.equal(2);
        done();
      });
  });

  it('should ensure documents are arranged in order of published date', (done) => {
    request.get('/api/documents')
      .set('authorization', adminToken)
      .expect(200)
      .end((err, res) => {
        expect(res.body.status).to.be.equal('success');
        expect(res.body.message).to.be.equal('Documents listed');
        expect(res.body.data[0].createdAt).to.be.above(res.body.data[1].createdAt);
        done();
      });
  });

  it('should be able to set offset and limit', (done) => {
    request.get('/api/documents?limit=1&offset=3')
      .set('authorization', adminToken)
      .expect(200)
      .end((err, res) => {
        expect(res.body.status).to.be.equal('success');
        expect(res.body.message).to.be.equal('Documents listed');
        expect(res.body.data.length).to.be.equal(1);
        expect(res.body.data[0].id).to.be.equal(3);
        done();
      });
  });

  it('should be able to update document', (done) => {
    request.put('/api/documents/6')
      .set('authorization', adminToken)
      .send({
        title: 'My updated document',
        content: 'Dynamic document',
      })
      .expect(200)
      .end((err, res) => {
        expect(res.body.status).to.be.equal('success');
        expect(res.body.message).to.be.equal('Document updated successfully');
        done();
      });
  });

  it('should not be able to update document with incorrect details', (done) => {
    request.put('/api/documents/6')
      .set('authorization', adminToken)
      .send({
        title: '',
        content: '',
        access: '',
      })
      .expect(200)
      .end((err, res) => {
        expect(res.body.status).to.be.equal('fail');
        expect(res.body.message).to.be.equal('You have errors in data submitted');
        done();
      });
  });

  it('should not create document without title', (done) => {
    request.post('/api/documents/')
      .set('Accept', 'application/json')
      .set('authorization', adminToken)
      .send({
        content: 'A document with no title',
      })
      .expect(403)
      .end((err, res) => {
        expect(res.body.status).to.be.equal('fail');
        done();
      });
  });

  it('should not create document without content', (done) => {
    request.post('/api/documents/')
      .set('Accept', 'application/json')
      .set('authorization', adminToken)
      .send({
        title: 'Another document',
      })
      .expect(403)
      .end((err, res) => {
        expect(res.body.status).to.be.equal('fail');
        done();
      });
  });

  it('should not create document with invalid access', () => {
    request.post('/api/documents/')
      .set('Accept', 'application/json')
      .set('authorization', adminToken)
      .send({
        title: 'A newer document',
        content: 'This document has invalid access',
        access: 'asdf',
      })
      .expect(403)
      .end((err, res) => {
        expect(res.body.status).to.be.equal('fail');
        done();
      });
  });

  it('should not create document that already exists', (done) => {
    request.post('/api/documents/')
      .set('Accept', 'application/json')
      .set('authorization', adminToken)
      .send({
        title: 'The parable of perry',
        content: 'The content',
      })
      .expect(403)
      .end((err, res) => {
        expect(res.body.status).to.be.equal('fail');
        expect(res.body.message).to.be.equal('Document already exists');
        done();
      });
  });

  it('should be able to delete document', (done) => {
    request.delete('/api/documents/6')
      .set('Accept', 'application/json')
      .set('authorization', adminToken)
      .expect(200)
      .end((err, res) => {
        expect(res.body.status).to.be.equal('success');
        expect(res.body.message).to.be.equal('Document deleted successfully');
        done();
      });
  });

  it('should not be able to delete other document', (done) => {
    request.delete('/api/documents/3')
      .set('Accept', 'application/json')
      .set('authorization', adminToken)
      .expect(403)
      .end((err, res) => {
        expect(res.body.status).to.be.equal('fail');
        expect(res.body.message).to.be.equal('You do not have permissions to view this document');
        done();
      });
  });

  it('should fail on non-existent document request', (done) => {
    request.get('/api/documents/8')
      .set('authorization', token)
      .expect(404)
      .end((err, res) => {
        expect(res.body.status).to.be.equal('fail');
        expect(res.body.message).to.be.equal('Document does not exists');
        done();
      });
  });

  it('should not view document not created by user', (done) => {
    request.get('/api/documents/1')
      .set('Accept', 'application/json')
      .set('authorization', token)
      .expect(403)
      .end((err, res) => {
        expect(res.body.status).to.be.equal('fail');
        expect(res.body.message).to.be.equal('You do not have permissions to view this document');
        done();
      });
  });
});

describe('Search', () => {
  it('should be able to access other user document marked as public', (done) => {
    request.get('/api/documents?access=public')
      .set('authorization', token)
      .expect(200)
      .end((err, res) => {
        expect(res.body.status).to.be.equal('success');
        expect(res.body.message).to.be.equal('Documents listed');
        expect(res.body.data.length).to.be.equal(2);
        done();
      });
  });

  it('should get limited documents', (done) => {
    request.get('/api/documents?limit=1')
      .set('authorization', adminToken)
      .expect(200)
      .end((err, res) => {
        expect(res.body.status).to.be.equal('success');
        expect(res.body.message).to.be.equal('Documents listed');
        expect(res.body.data.length).to.be.equal(1);
        done();
      });
  });

  it('should get limited documents', (done) => {
    request.get('/api/documents?limit=1&role=regular')
      .set('authorization', adminToken)
      .expect(200)
      .end((err, res) => {
        expect(res.body.status).to.be.equal('success');
        expect(res.body.message).to.be.equal('Documents listed');
        expect(res.body.data.length).to.be.equal(1);
        expect(res.body.data[0].role).to.be.equal('regular');
        done();
      });
  });
});
