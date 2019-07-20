/* eslint-disable max-len */
/* eslint-env mocha */
import chai from 'chai';

import chaiHttp from 'chai-http';

import fs from 'fs';

import app from '../../index';

const { expect } = chai;

chai.use(chaiHttp);
let userToken;
let adminTokenDb;
let propertyId;

describe('Test suite for all property related endpoints', () => {
  before((done) => {
    chai
      .request(app)
      .post('/api/v2/auth/signin')
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
        adminTokenDb = token;
        done(err);
      });
  });
  before((done) => {
    chai
      .request(app)
      .post('/api/v1/property')
      .set('x-access-token', adminTokenDb)
      .set('enctype', 'multipart/formdata')
      .type('form')
      .attach('image_url', `${__dirname}/imageFolder/deborah-cortelazzi-615800-unsplash_opt.jpg`)
      .field('state', 'Lagos')
      .field('city', 'Alimosho')
      .field('price', 60000000.50)
      .field('address', '67 Bamgboye close')
      .field('type', 'Land')
      .end((err, res) => {
        const { id } = res.body.data;
        propertyId = id;
        done(err);
      });
  });
  describe('POST api/v2/property', () => {
    const filePath = `${__dirname}/imageFolder/deborah-cortelazzi-615800-unsplash_opt.jpg`;
    it('Should list a new property if all checks are fine', (done) => {
      chai
        .request(app)
        .post('/api/v2/property')
        .set('x-access-token', userToken)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .attach('image_url', `${__dirname}/imageFolder/deborah-cortelazzi-615800-unsplash_opt.jpg`)
        .field('state', 'Lagos')
        .field('city', 'Alimosho')
        .field('price', 60000000.50)
        .field('address', '67 Bamgboye close')
        .field('type', 'Land')
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.status).to.be.equal('success');
          expect(res.body.data).to.have.key('id', 'status', 'type', 'state',
            'city', 'address', 'price', 'created_on', 'image_url');
          done();
        });
    });
    it('Should return an error if the content type isn\'t formdata', (done) => {
      chai
        .request(app)
        .post('/api/v2/property')
        .set('x-access-token', userToken)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({
          state: 'Lagos',
          city: 'Alimosho',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.equal('Change your content type and try again');
          done();
        });
    });
    it('Should throw an error if user is not Logged in', (done) => {
      chai
        .request(app)
        .post('/api/v2/property')
        .set('enctype', 'multipart/formdata')
        .type('form')
        .attach('image_url', fs.readFileSync(filePath), 'deborah-cortelazzi-615800-unsplash_opt.jpg')
        .field('state', 'Lagos')
        .field('city', 'Alimosho')
        .field('price', 60000000.50)
        .field('address', '67 Bamgboye close')
        .field('type', 'Land')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.equal('You do not have access to this resource');
          done();
        });
    });
    it('Should return an error if no image is attached', (done) => {
      chai
        .request(app)
        .post('/api/v2/property')
        .set('x-access-token', userToken)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .field('state', 'Lagos')
        .field('city', 'Alimosho')
        .field('price', 60000000.50)
        .field('address', '67 Bamgboye close')
        .field('type', 'Land')
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.an('object');
          done();
        });
    });
    it('Should return an error if no state is indicated', (done) => {
      chai
        .request(app)
        .post('/api/v2/property')
        .set('x-access-token', userToken)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .attach('image_url', fs.readFileSync(filePath), 'deborah-cortelazzi-615800-unsplash_opt.jpg')
        .field('city', 'Alimosho')
        .field('price', 60000000.50)
        .field('address', '67 Bamgboye close')
        .field('type', 'Land')
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.an('object');
          expect(res.body.error.state).to.be.equal('state cannot be left empty');
          done();
        });
    });
    it('Should return an error if no price is indicated', (done) => {
      chai
        .request(app)
        .post('/api/v2/property')
        .set('x-access-token', userToken)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .attach('image_url', fs.readFileSync(filePath), 'deborah-cortelazzi-615800-unsplash_opt.jpg')
        .field('state', 'Lagos')
        .field('city', 'Alimosho')
        .field('address', '67 Bamgboye close')
        .field('type', 'Land')
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.an('object');
          expect(res.body.error.price).to.be.equal('price cannot be left empty');
          done();
        });
    });
    it('Should return an error if no city is indicated', (done) => {
      chai
        .request(app)
        .post('/api/v2/property')
        .set('x-access-token', userToken)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .attach('image_url', fs.readFileSync(filePath), 'deborah-cortelazzi-615800-unsplash_opt.jpg')
        .field('state', 'Lagos')
        .field('price', 60000000.50)
        .field('address', '67 Bamgboye close')
        .field('type', 'Land')
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.an('object');
          expect(res.body.error.city).to.be.equal('city cannot be left empty');
          done();
        });
    });
    it('Should return an error if no address is indicated', (done) => {
      chai
        .request(app)
        .post('/api/v2/property')
        .set('x-access-token', userToken)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .attach('image_url', fs.readFileSync(filePath), 'deborah-cortelazzi-615800-unsplash_opt.jpg')
        .field('state', 'Lagos')
        .field('city', 'Alimosho')
        .field('price', 60000000.50)
        .field('type', 'Land')
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.an('object');
          expect(res.body.error.address).to.be.equal('address cannot be left empty');
          done();
        });
    });
    it('Should return an error if no type is indicated', (done) => {
      chai
        .request(app)
        .post('/api/v2/property')
        .set('x-access-token', userToken)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .attach('image_url', fs.readFileSync(filePath), 'deborah-cortelazzi-615800-unsplash_opt.jpg')
        .field('state', 'Lagos')
        .field('city', 'Alimosho')
        .field('price', 60000000.50)
        .field('address', '67 Bamgboye close')
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.an('object');
          expect(res.body.error.property_type).to.be.equal('type cannot be left empty');
          done();
        });
    });
    it('Should return an error if the state is invalid', (done) => {
      chai
        .request(app)
        .post('/api/v2/property')
        .set('x-access-token', userToken)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .attach('image_url', fs.readFileSync(filePath), 'deborah-cortelazzi-615800-unsplash_opt.jpg')
        .field('state', 'Lag')
        .field('city', 'Alimosho')
        .field('price', 60000000.50)
        .field('address', '67 Bamgboye close')
        .field('type', 'Land')
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.an('object');
          expect(res.body.error.state).to.be.equal('Invalid state provided. A valid state is at least 4 characters long without numbers and special characters');
          done();
        });
    });
    it('Should return an error if the city is invalid', (done) => {
      chai
        .request(app)
        .post('/api/v2/property')
        .set('x-access-token', userToken)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .attach('image_url', fs.readFileSync(filePath), 'deborah-cortelazzi-615800-unsplash_opt.jpg')
        .field('state', 'Lagos')
        .field('city', 'Ali')
        .field('price', 60000000.50)
        .field('address', '67 Bamgboye close')
        .field('type', 'Land')
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.an('object');
          expect(res.body.error.city).to.be.equal('Invalid city provided. A valid city is at least 4 characters long without numbers and special characters');
          done();
        });
    });
    it('Should return an error if the property type is less than 4 characters', (done) => {
      chai
        .request(app)
        .post('/api/v2/property')
        .set('x-access-token', userToken)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .attach('image_url', fs.readFileSync(filePath), 'deborah-cortelazzi-615800-unsplash_opt.jpg')
        .field('state', 'Lagos')
        .field('city', 'Alimosho')
        .field('price', 60000000.50)
        .field('address', '67 Bamgboye close')
        .field('type', 'Lan')
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.an('object');
          expect(res.body.error.property_type).to.be.equal('Invalid property type selected. A valid property type is at least four characters long');
          done();
        });
    });
    it('Should return an error if the address is less than 7 characters', (done) => {
      chai
        .request(app)
        .post('/api/v2/property')
        .set('x-access-token', userToken)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .attach('image_url', fs.readFileSync(filePath), 'deborah-cortelazzi-615800-unsplash_opt.jpg')
        .field('state', 'Lagos State')
        .field('city', 'Alimosho')
        .field('price', 60000000.50)
        .field('address', '67')
        .field('type', 'Land')
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.an('object');
          expect(res.body.error.address).to.be.equal('Invalid address provided. A valid address is at least seven characters long');
          done();
        });
    });
    it('Should return an error if the price is not valid', (done) => {
      chai
        .request(app)
        .post('/api/v2/property')
        .set('x-access-token', userToken)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .attach('image_url', fs.readFileSync(filePath), 'deborah-cortelazzi-615800-unsplash_opt.jpg')
        .field('state', 'Lagos State')
        .field('city', 'Alimosho')
        .field('price', 'hello')
        .field('address', '67 Bamgboye close')
        .field('type', 'Land')
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.an('object');
          expect(res.body.error.price).to.be.equal('Invalid price provided');
          done();
        });
    });
  });
  describe('POST api/v1/property', () => {
    const filePath = `${__dirname}/imageFolder/deborah-cortelazzi-615800-unsplash_opt.jpg`;
    it('Should list a new property if all checks are fine', (done) => {
      chai
        .request(app)
        .post('/api/v1/property')
        .set('x-access-token', adminTokenDb)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .attach('image_url', filePath)
        .field('state', 'Lagos')
        .field('city', 'Alimosho')
        .field('price', 60000000.50)
        .field('address', '67 Bamgboye close')
        .field('type', 'Land')
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.status).to.be.equal('success');
          expect(res.body.data).to.have.key('id', 'status', 'type', 'state',
            'city', 'address', 'price', 'created_on', 'image_url');
          done();
        });
    });
  });
  describe('PATCH api/v2/property/:id', () => {
    const filePath = `${__dirname}/imageFolder/deborah-cortelazzi-615800-unsplash_opt.jpg`;
    it('Should update specific details of a property if all checks are fine', (done) => {
      const id = 1;
      chai
        .request(app)
        .patch(`/api/v2/property/${id}`)
        .set('x-access-token', userToken)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .field('state', 'Lagos')
        .field('city', 'Alimosho')
        .field('price', 60000000.50)
        .field('address', '33 Bashorun drive')
        .field('type', '2 Bedroom')
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.status).to.be.equal('success');
          expect(res.body.data).to.have.key('id', 'owner', 'status', 'price', 'state', 'city', 'address', 'type',
            'created_on', 'image_url');
          done();
        });
    });
    it('Should throw an error if user is not Logged in', (done) => {
      const id = 1;
      chai
        .request(app)
        .patch(`/api/v2/property/${id}`)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .attach('image', fs.readFileSync(filePath), 'deborah-cortelazzi-615800-unsplash_opt.jpg')
        .field('state', 'Lagos')
        .field('city', 'Alimosho')
        .field('price', 60000000.50)
        .field('address', '67 Bamgboye close')
        .field('type', 'Land')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.equal('You do not have access to this resource');
          done();
        });
    });
    it('Should return an error if the property with the requested id does not exist', (done) => {
      const id = 44;
      chai
        .request(app)
        .patch(`/api/v2/property/${id}`)
        .set('x-access-token', userToken)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .attach('image', fs.readFileSync(filePath), 'deborah-cortelazzi-615800-unsplash_opt.jpg')
        .field('state', 'Lagos')
        .field('city', 'Alimosho')
        .field('price', 60000000.50)
        .field('address', '67 Bamgboye close')
        .field('type', 'Land')
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.equal('Property with the specified id not found');
          done();
        });
    });
    it('Should return an error if the price to update is not a valid price', (done) => {
      const id = 1;
      chai
        .request(app)
        .patch(`/api/v2/property/${id}`)
        .set('x-access-token', userToken)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .field('state', 'Lagos')
        .field('city', 'Alimosho')
        .field('price', 'price')
        .field('address', '67 Bamgboye close')
        .field('type', 'Land')
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.an('object');
          done();
        });
    });
    it('Should return an error if the property type to update is not a valid type', (done) => {
      const id = 1;
      chai
        .request(app)
        .patch(`/api/v2/property/${id}`)
        .set('x-access-token', userToken)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .field('state', 'Lagos')
        .field('city', 'Alimosho')
        .field('price', 50000.50)
        .field('address', '67 Bamgboye close')
        .field('type', 'Lan')
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.an('object');
          expect(res.body.error.property_type).to.be.equal('Invalid property type selected. A valid property type is at least four characters long');
          done();
        });
    });
    it('Should return an error if the state to update is invalid', (done) => {
      const id = 1;
      chai
        .request(app)
        .patch(`/api/v2/property/${id}`)
        .set('x-access-token', userToken)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .field('state', 'st1te5%')
        .field('city', 'Alimosho')
        .field('price', 60000000.50)
        .field('address', '67 Bamgboye close')
        .field('type', 'Land')
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.an('object');
          expect(res.body.error.state).to.be.equal('Invalid state provided. A valid state is at least 4 characters long without numbers and special characters');
          done();
        });
    });
    it('Should return an error if the city to update is invalid', (done) => {
      const id = 1;
      chai
        .request(app)
        .patch(`/api/v2/property/${id}`)
        .set('x-access-token', userToken)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .field('state', 'Lagos State')
        .field('city', 'Bar')
        .field('price', 60000000.50)
        .field('address', '67 Bamgboye close')
        .field('type', 'Land')
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error.city).to.be.equal('Invalid city provided. A valid city is at least 4 characters long without numbers and special characters');
          done();
        });
    });
    it('Should return an error if the agent adds an invalid address', (done) => {
      const id = 1;
      chai
        .request(app)
        .patch(`/api/v2/property/${id}`)
        .set('x-access-token', userToken)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .field('state', 'Lagos State')
        .field('city', 'Alimosho')
        .field('price', 60000000.50)
        .field('address', 'No')
        .field('type', 'Land')
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.an('object');
          expect(res.body.error.address).to.be.equal('Invalid address provided. A valid address is at least seven characters long');
          done();
        });
    });
  });
  describe('PATCH api/v1/property/:id', () => {
    it('Should update specific details of a property if all checks are fine', (done) => {
      const id = 1;
      chai
        .request(app)
        .patch(`/api/v1/property/${id}`)
        .set('x-access-token', adminTokenDb)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .field('state', 'Lagos State')
        .field('city', 'Alimosho')
        .field('price', 60000000.50)
        .field('address', '33 Bashorun drive')
        .field('type', '2 Bedroom')
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.status).to.be.equal('success');
          expect(res.body.data).to.have.key('id', 'owner', 'status', 'price', 'state', 'city', 'address', 'type',
            'created_on', 'image_url');
          done();
        });
    });
    it('Should return an error if the property with the requested id does not exist', (done) => {
      const id = 567;
      chai
        .request(app)
        .patch(`/api/v1/property/${id}`)
        .set('x-access-token', adminTokenDb)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .field('state', 'Lagos State')
        .field('city', 'Alimosho')
        .field('price', 60000000.50)
        .field('address', '67 Bamgboye close')
        .field('type', 'Land')
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.equal('Property with the provided id not found');
          done();
        });
    });
  });
  describe('PATCH api/v2/property/:id/sold', () => {
    it('Should update the status of a listed property to sold if all checks are fine', (done) => {
      const id = 1;
      chai
        .request(app)
        .patch(`/api/v2/property/${id}/sold`)
        .set('x-access-token', userToken)
        .send({
          status: 'Sold',
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.status).to.be.equal('success');
          expect(res.body.data).to.have.key('id', 'owner', 'status', 'price', 'state', 'city', 'address', 'type',
            'created_on', 'image_url');
          done();
        });
    });
    it('Should throw an error if user is not Logged in', (done) => {
      const id = 1;
      chai
        .request(app)
        .patch(`/api/v2/property/${id}/sold`)
        .send({
          status: 'Sold',
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.equal('You do not have access to this resource');
          done();
        });
    });
    it('Should return an error if an agent with the requesting id does not exist', (done) => {
      const id = 44;
      chai
        .request(app)
        .patch(`/api/v2/property/${id}/sold`)
        .set('x-access-token', userToken)
        .send({
          status: 'Sold',
        })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.equal('Property with the specified id not found');
          done();
        });
    });
    it('Should return an error if the user puts in a wrong value as status', (done) => {
      const id = 1;
      chai
        .request(app)
        .patch(`/api/v2/property/${id}/sold`)
        .set('x-access-token', userToken)
        .send({
          status: 'Awaiting',
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.equal('Invalid status provided. You can only mark a property as \'Sold\'');
          done();
        });
    });
  });
  describe('PATCH api/v2/property/:id/sold', () => {
    it('Should update the status of a listed property to sold if all checks are fine', (done) => {
      const id = 4;
      chai
        .request(app)
        .patch(`/api/v1/property/${id}/sold`)
        .set('x-access-token', adminTokenDb)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.status).to.be.equal('success');
          expect(res.body.data).to.have.key('id', 'owner', 'status', 'price', 'state', 'city', 'address', 'type',
            'created_on', 'image_url');
          done();
        });
    });
  });
  describe('DELETE api/v2/property/:id', () => {
    it('Should delete a listed property if all checks are fine', (done) => {
      const id = 2;
      chai
        .request(app)
        .delete(`/api/v2/property/${id}`)
        .set('x-access-token', userToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.be.equal('success');
          expect(res.body.data.message).to.be.equal('Property deleted successfully');
          done();
        });
    });
    it('Should throw an error if user is not Logged in', (done) => {
      const id = 1;
      chai
        .request(app)
        .delete(`/api/v2/property/${id}`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.equal('You do not have access to this resource');
          done();
        });
    });
    it('Should return an error if a property with the requesting id does not exist', (done) => {
      const id = 44;
      chai
        .request(app)
        .delete(`/api/v2/property/${id}`)
        .set('x-access-token', userToken)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.equal('Property with the specified id not found');
          done();
        });
    });
  });
  describe('DELETE api/v1/property/:id', () => {
    it('Should delete a listed property if all checks are fine', (done) => {
      const id = propertyId;
      chai
        .request(app)
        .delete(`/api/v1/property/${id}`)
        .set('x-access-token', adminTokenDb)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.be.equal('success');
          expect(res.body.data.message).to.be.equal('Property deleted successfully');
          done();
        });
    });
  });
  describe('GET api/v2/property', () => {
    it('Should return an array of all listed properties', (done) => {
      chai
        .request(app)
        .get('/api/v2/property')
        .set('x-access-token', userToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.be.equal('success');
          expect(res.body.data).to.be.an('array');
          done();
        });
    });
    it('Should throw an error if user is not Logged in', (done) => {
      chai
        .request(app)
        .get('/api/v2/property')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.equal('You do not have access to this resource');
          done();
        });
    });
  });
  describe('GET api/v1/property', () => {
    it('Should return an array of all listed properties', (done) => {
      chai
        .request(app)
        .get('/api/v1/property')
        .set('x-access-token', userToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.be.equal('success');
          expect(res.body.data).to.be.an('array');
          done();
        });
    });
  });
  describe('GET api/v2/property?type=<propertyType>', () => {
    it('Should return an arfray of all listed properties', (done) => {
      chai
        .request(app)
        .get('/api/v2/property?type=Land')
        .set('x-access-token', userToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.be.equal('success');
          expect(res.body.data).to.be.an('array');
          done();
        });
    });
    it('Should return an error if the type of query the user puts in is invalid', (done) => {
      chai
        .request(app)
        .get('/api/v2/property?type=InvalidType')
        .set('x-access-token', userToken)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.equal('No property with the specified type');
          done();
        });
    });
  });
  describe('GET api/v1/property?type=<propertyType>', () => {
    it('Should return an array of all listed properties', (done) => {
      chai
        .request(app)
        .get('/api/v1/property?type=Land')
        .set('x-access-token', adminTokenDb)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.be.equal('success');
          expect(res.body.data).to.be.an('array');
          done();
        });
    });
    it('Should return an error if the type of query the user puts in is invalid', (done) => {
      chai
        .request(app)
        .get('/api/v1/property?type=InvalidType')
        .set('x-access-token', adminTokenDb)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.equal('No property with the specified type');
          done();
        });
    });
  });
  describe('GET api/v2/property/:id', () => {
    it('Should return an arrray of a particular property if the id exists', (done) => {
      chai
        .request(app)
        .get('/api/v2/property/1')
        .set('x-access-token', userToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.be.equal('success');
          expect(res.body.data).to.be.an('array');
          done();
        });
    });
  });
  describe('GET api/v1/property/:id', () => {
    it('Should return information about a property if the id exists', (done) => {
      chai
        .request(app)
        .get('/api/v1/property/1')
        .set('x-access-token', adminTokenDb)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.be.equal('success');
          expect(res.body.data).to.have.key('id', 'status', 'price', 'state', 'city', 'type', 'address',
            'created_on', 'image_url', 'owner_email', 'owner_phone_number');
          done();
        });
    });
    it('Should return an error if a property with the specified id does not exist', (done) => {
      chai
        .request(app)
        .get('/api/v1/property/1000')
        .set('x-access-token', userToken)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.equal('Property with the provided id not found');
          done();
        });
    });
    it('Should return an error if the specified id is not a number', (done) => {
      chai
        .request(app)
        .get('/api/v1/property/1000o')
        .set('x-access-token', userToken)
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.equal('Invalid id selected. A valid id is a number');
          done();
        });
    });
  });
});
