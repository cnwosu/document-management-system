import { Role } from '../../models/index';

const chai = require('chai');

const app = require('../../../server');

const request = require('supertest')(app);

const expect = chai.expect;

describe('Routes', () => {
  it('should display status message when user visits base route',
    (done) => {
      request.get('/').expect(200)
      .then(() => {
        done();
      });
    });
});
