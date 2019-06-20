/* eslint-disable no-undef */
import chai from 'chai';

import chaiHttp from 'chai-http';

import app from '../../index';

const { expect } = chai;

chai.use(chaiHttp);

describe('Tests for Home page related endpoints', () => {
  describe('GET / ', () => {
    it('Should display a welcome message', (done) => {
      chai
        .request(app)
        .get('/')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.be.equal(200);
          expect(res.body.message).to.be.equal('Welcome To PropertyPro');
          done();
        });
    });
  });
});
