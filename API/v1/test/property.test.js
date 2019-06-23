/* eslint-env mocha */
import chai from 'chai';

import chaiHttp from 'chai-http';

import fs from 'fs';

import app from '../../index';

const { expect } = chai;

chai.use(chaiHttp);
let userToken;
let adminToken;

describe('Test suite for all property related endpoints', () => {
  before((done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'chrisbreezy@gmail.com',
        password: 'chrisbrownTheman',
      })
      .end((err, res) => {
        const { token } = res.body.data;
        userToken = token;
        done(err);
      });
  });
  before((done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'fergusoniyara@gmail.com',
        password: 'somepassword',
      })
      .end((err, res) => {
        const { token } = res.body.data;
        adminToken = token;
        done(err);
      });
  });
  describe('POST api/v1/property', () => {
    const filePath = `${__dirname}/imageFolder/deborah-cortelazzi-615800-unsplash_opt.jpg`;
    it('Should list a new property if all checks are fine', (done) => {
      chai
        .request(app)
        .post('/api/v1/property')
        .set('x-access-token', adminToken)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .attach('image', fs.readFileSync(filePath), 'deborah-cortelazzi-615800-unsplash_opt.jpg')
        .field('state', 'Lagos State')
        .field('city', 'Alimosho')
        .field('price', 60000000.50)
        .field('address', '67 Bamgboye close')
        .field('type', 'Land')
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.status).to.be.equal('success');
          expect(res.body.data).to.have.key('id', 'status', 'type', 'state',
            'city', 'address', 'price', 'createdOn', 'imageUrl');
          done();
        });
    });
    it('Should throw an error if user is not Logged in', (done) => {
      chai
        .request(app)
        .post('/api/v1/property')
        .set('enctype', 'multipart/formdata')
        .type('form')
        .attach('image', fs.readFileSync(filePath), 'deborah-cortelazzi-615800-unsplash_opt.jpg')
        .field('state', 'Lagos State')
        .field('city', 'Alimosho')
        .field('price', 60000000.50)
        .field('address', '67 Bamgboye close')
        .field('type', 'Land')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.status).to.be.equal(401);
          expect(res.body.error).to.be.equal('You do not have access to this resource');
          done();
        });
    });
    it('Should return an error if a user wants to post a property', (done) => {
      chai
        .request(app)
        .post('/api/v1/property')
        .set('x-access-token', userToken)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .attach('image', fs.readFileSync(filePath), 'deborah-cortelazzi-615800-unsplash_opt.jpg')
        .field('state', 'Lagos State')
        .field('city', 'Alimosho')
        .field('price', 60000000.50)
        .field('address', '67 Bamgboye close')
        .field('type', 'Land')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.status).to.be.equal(401);
          expect(res.body.error).to.be.equal('Only an Agent can post a property');
          done();
        });
    });
    it('Should return an error if no image is attached', (done) => {
      chai
        .request(app)
        .post('/api/v1/property')
        .set('x-access-token', adminToken)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .field('state', 'Lagos State')
        .field('city', 'Alimosho')
        .field('price', 60000000.50)
        .field('address', '67 Bamgboye close')
        .field('type', 'Land')
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body.error).to.be.equal('image cannot be left empty');
          done();
        });
    });
    it('Should return an error if no state is indicated', (done) => {
      chai
        .request(app)
        .post('/api/v1/property')
        .set('x-access-token', adminToken)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .attach('image', fs.readFileSync(filePath), 'deborah-cortelazzi-615800-unsplash_opt.jpg')
        .field('city', 'Alimosho')
        .field('price', 60000000.50)
        .field('address', '67 Bamgboye close')
        .field('type', 'Land')
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body.error).to.be.equal('state cannot be left empty');
          done();
        });
    });
    it('Should return an error if no price is indicated', (done) => {
      chai
        .request(app)
        .post('/api/v1/property')
        .set('x-access-token', adminToken)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .attach('image', fs.readFileSync(filePath), 'deborah-cortelazzi-615800-unsplash_opt.jpg')
        .field('state', 'Lagos State')
        .field('city', 'Alimosho')
        .field('address', '67 Bamgboye close')
        .field('type', 'Land')
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body.error).to.be.equal('price cannot be left empty');
          done();
        });
    });
    it('Should return an error if no city is indicated', (done) => {
      chai
        .request(app)
        .post('/api/v1/property')
        .set('x-access-token', adminToken)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .attach('image', fs.readFileSync(filePath), 'deborah-cortelazzi-615800-unsplash_opt.jpg')
        .field('state', 'Lagos State')
        .field('price', 60000000.50)
        .field('address', '67 Bamgboye close')
        .field('type', 'Land')
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body.error).to.be.equal('city cannot be left empty');
          done();
        });
    });
    it('Should return an error if no address is indicated', (done) => {
      chai
        .request(app)
        .post('/api/v1/property')
        .set('x-access-token', adminToken)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .attach('image', fs.readFileSync(filePath), 'deborah-cortelazzi-615800-unsplash_opt.jpg')
        .field('state', 'Lagos State')
        .field('city', 'Alimosho')
        .field('price', 60000000.50)
        .field('type', 'Land')
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body.error).to.be.equal('address cannot be left empty');
          done();
        });
    });
    it('Should return an error if no type is indicated', (done) => {
      chai
        .request(app)
        .post('/api/v1/property')
        .set('x-access-token', adminToken)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .attach('image', fs.readFileSync(filePath), 'deborah-cortelazzi-615800-unsplash_opt.jpg')
        .field('state', 'Lagos State')
        .field('city', 'Alimosho')
        .field('price', 60000000.50)
        .field('address', '67 Bamgboye close')
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body.error).to.be.equal('type cannot be left empty');
          done();
        });
    });
    it('Should return an error if the state is not valid', (done) => {
      chai
        .request(app)
        .post('/api/v1/property')
        .set('x-access-token', adminToken)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .attach('image', fs.readFileSync(filePath), 'deborah-cortelazzi-615800-unsplash_opt.jpg')
        .field('state', 'Casablanca')
        .field('city', 'Alimosho')
        .field('price', 60000000.50)
        .field('address', '67 Bamgboye close')
        .field('type', 'Land')
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body.error).to.be.equal('Invalid state provided');
          done();
        });
    });
    it('Should return an error if the city is not valid', (done) => {
      chai
        .request(app)
        .post('/api/v1/property')
        .set('x-access-token', adminToken)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .attach('image', fs.readFileSync(filePath), 'deborah-cortelazzi-615800-unsplash_opt.jpg')
        .field('state', 'Lagos State')
        .field('city', 'Cincinnati')
        .field('price', 60000000.50)
        .field('address', '67 Bamgboye close')
        .field('type', 'Land')
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body.error).to.be.equal('Invalid city provided');
          done();
        });
    });
    it('Should return an error if the property type is not valid', (done) => {
      chai
        .request(app)
        .post('/api/v1/property')
        .set('x-access-token', adminToken)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .attach('image', fs.readFileSync(filePath), 'deborah-cortelazzi-615800-unsplash_opt.jpg')
        .field('state', 'Lagos State')
        .field('city', 'Alimosho')
        .field('price', 60000000.50)
        .field('address', '67 Bamgboye close')
        .field('type', 'Invalid Type')
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body.error).to.be.equal('Invalid property type provided');
          done();
        });
    });
    it('Should return an error if the property type is not valid', (done) => {
      chai
        .request(app)
        .post('/api/v1/property')
        .set('x-access-token', adminToken)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .attach('image', fs.readFileSync(filePath), 'deborah-cortelazzi-615800-unsplash_opt.jpg')
        .field('state', 'Lagos State')
        .field('city', 'Alimosho')
        .field('price', 'hello')
        .field('address', '67 Bamgboye close')
        .field('type', 'Land')
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body.error).to.be.equal('Invalid price provided');
          done();
        });
    });
  });
});
