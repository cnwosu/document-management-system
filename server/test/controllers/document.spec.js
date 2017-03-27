const chai = require('chai');

const app = require('../../../server');

const request = require('supertest')(app);

const expect = chai.expect;

describe('Document', () => {
  let adminToken;
  let regularToken;
  const newDocument = {
    title: 'My document',
    content: 'This is a cool document',
    userId: 1,
    access: 'private'
  };
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
      .send(newDocument)
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
      .expect(401)
      .then((res) => {
        expect(res.body.message).to.equal('User cannot access document');
        done();
      });
  });

  it('should ensure document has property set to public by default', () => {
    request.post('/api/documents')
      .set('authorization', regularToken)
      .send({
        title: 'My default document',
        content: 'This is a default document',
        userId: 2
      })
      .expect(201)
      .then((res) => {
        expect(res.access).to.equal('public');
      });
  });

  it('should ensure only the creator can access private document', (done) => {
    request.get(`/api/documents/${documentCreated.id}`)
      .set('authorization', adminToken)
      .expect(200)
      .then(() => {
        done();
      });
  });

  it('should ensure document created has published date defined', () => {
    expect(typeof documentCreated.createdAt).to.not.equal('undefined');
  });

  it('should get all documents', (done) => {
    request.get('/api/documents')
      .set('authorization', adminToken)
      .expect(200)
      .then(() => {
        done();
      });
  });

  it('should get limited documents', (done) => {
    const limit = 2,
      offset = 0;
    request.get(`/api/documents?limit=${limit}&offset=${offset}`)
      .set('authorization', adminToken)
      .expect(200)
      .then((res) => {
        expect(res.body.length).to.equal(limit);
        done();
      });
  });

  it('should ensure documents are arranged in order of published date', (done) => {
    request.get('/api/documents')
      .set('authorization', adminToken)
      .expect(200)
      .then((res) => {
        expect(res.body[1].createdAt).to.not.be.above(res.body[0].createdAt);
        done();
      });
  });

  it('should be able to set offset and limit', (done) => {
    const limit = 2,
      offset = 1;
    request.get(`/api/documents?limit=${limit}&offset=${offset}`)
      .set('authorization', adminToken)
      .expect(200)
      .then((res) => {
        expect(res.body.length).to.equal(limit);
        expect(res.body[0].id).to.equal(2);
        done();
      });
  });

  it('should not view document not created by user and not set to public', (done) => {
    request.get(`/api/documents/${documentCreated.id}`)
      .set('authorization', regularToken)
      .expect(401)
      .then((res) => {
        expect(res.body.message).to.equal('User cannot access document');
        done();
      });
  });

  it('should be able to update documents if requested by Admin', (done) => {
    request.put('/api/documents/1')
      .set('authorization', adminToken)
      .send({
        title: 'My updated document',
        content: 'Dynamic document',
        userId: 1,
        access: 'private'
      })
      .expect(200)
      .then((res) => {
        expect(res.body.message).to.equal('Document details Updated');
        done();
      });
  });

  it('should not be able to update documents if not requested by Admin', (done) => {
    request.put('/api/documents/1')
      .set('authorization', regularToken)
      .send({
        title: 'My updated document',
        content: 'Dynamic document',
        userId: 2,
        access: 'private'
      })
      .expect(401)
      .then((res) => {
        expect(res.body.message).to.equal('User Unauthorized');
        done();
      });
  });

  it('should be able to update documents if created by the user', (done) => {
    request.post('/api/documents')
      .set('authorization', regularToken)
      .send({
        title: 'My new document',
        content: 'Dynamic document',
        userId: 2,
        access: 'public'
      })
      .expect(201)
      .then((res) => {
        request.put(`/api/documents/${res.body.id}`)
            .set('authorization', regularToken)
            .send({
              title: 'My updated document',
              content: 'Dynamic document',
              userId: 2,
              access: 'private'
            })
            .expect(200)
            .then((res) => {
              expect(res.body.message).to.equal('Document details Updated');
              done();
            });
      });
  });

  it('should not be able to update documents if not created by the user', (done) => {
    request.put(`/api/documents/${documentCreated.id}`)
      .set('authorization', regularToken)
      .send({
        title: 'My updated document',
        content: 'Dynamic document',
        userId: 2,
        access: 'private'
      })
      .expect(401)
      .then((res) => {
        expect(res.body.message).to.equal('User Unauthorized');
        done();
      });
  });

  it('should not be able to update document with invalid access type', (done) => {
    request.put(`/api/documents/${documentCreated.id}`)
      .set('authorization', adminToken)
      .send({
        access: 'access',
      })
      .expect(400)
      .then((res) => {
        expect(res.body.message).to.equal('Invalid request parameters');
        done();
      });
  });

  it('should not create document without title', (done) => {
    request.post('/api/documents/')
      .set('authorization', adminToken)
      .send({
        content: 'A document with no title',
      })
      .expect(400)
      .then((res) => {
        expect(res.body.message).to.equal('Invalid request');
        done();
      });
  });

  it('should not create document without content', (done) => {
    request.post('/api/documents/')
      .set('authorization', adminToken)
      .send({
        title: 'Another invalid document',
      })
      .expect(400)
      .then((res) => {
        expect(res.body.message).to.equal('Invalid request');
        done();
      });
  });

  it('should not create document with invalid access', (done) => {
    request.post('/api/documents/')
      .set('Accept', 'application/json')
      .set('authorization', adminToken)
      .send({
        title: 'A newer document',
        content: 'This document has invalid access',
        access: 'asdf',
      })
      .expect(400)
      .then((res) => {
        expect(res.body.message).to.equal('Invalid request');
        done();
      });
  });

  it('should not create document that already exists', (done) => {
    request.post('/api/documents/')
      .set('authorization', adminToken)
      .send(newDocument)
      .expect(409)
      .then((res) => {
        expect(res.body.message).to.equal('Document already exists');
        done();
      });
  });

  it('should not be able to delete others document', (done) => {
    request.delete(`/api/documents/${documentCreated.id}`)
      .set('authorization', regularToken)
      .expect(401)
      .then((res) => {
        expect(res.body.message).to.equal('User Unauthorized');
        done();
      });
  });

  it('should be able to delete a document if user is admin', (done) => {
    request.delete(`/api/documents/${documentCreated.id}`)
      .set('authorization', adminToken)
      .expect(200)
      .then((res) => {
        expect(res.body.message).to.equal('Document successfully deleted');
        done();
      });
  });

  it('should return 404 on non-existent document request', (done) => {
    request.get('/api/documents/9089808')
      .set('authorization', adminToken)
      .expect(404)
      .then((res) => {
        expect(res.body.message).to.equal('Document does not exist');
        done();
      });
  });

  describe('Search', () => {
    it('should search documents specified by a given title', (done) => {
      request.get('/api/search/documents?q=updated')
      .set('authorization', adminToken)
      .expect(200)
      .then((res) => {
        expect(res.body.length).to.not.equal(0);
        done();
      });
    });

    it('should get documents limited by number and published on a certain date', (done) => {
      request.get('/api/search/documents?limit=1')
      .set('authorization', adminToken)
      .expect(200)
      .end((err, res) => {
        expect(res.body.status).to.be.equal('success');
        expect(res.body.message).to.be.equal('Documents listed');
        expect(res.body.data.length).to.be.equal(1);
        done();
      });
    });

    it('should get documents created by specified role', (done) => {
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
});
