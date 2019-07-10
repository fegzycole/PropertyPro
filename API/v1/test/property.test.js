/* eslint-env mocha */
import chai from 'chai';

import chaiHttp from 'chai-http';

import fs from 'fs';

import app from '../../index';

const { expect } = chai;

chai.use(chaiHttp);
let userToken;
let adminToken;
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
      .post('/api/v2/auth/signin')
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
      .attach('image', `${__dirname}/imageFolder/deborah-cortelazzi-615800-unsplash_opt.jpg`)
      .field('state', 'Lagos State')
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
        .set('x-access-token', adminToken)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .attach('image', `${__dirname}/imageFolder/deborah-cortelazzi-615800-unsplash_opt.jpg`)
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
    it('Should return an error if the content type isn\'t formdata', (done) => {
      chai
        .request(app)
        .post('/api/v2/property')
        .set('x-access-token', adminToken)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({
          state: 'Lagos State',
          city: 'Alimosho',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
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
        .post('/api/v2/property')
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
          expect(res).to.have.status(403);
          expect(res.body.status).to.be.equal(403);
          expect(res.body.error).to.be.equal('You are not authorized to view this resource');
          done();
        });
    });
    it('Should return an error if no image is attached', (done) => {
      chai
        .request(app)
        .post('/api/v2/property')
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
        .post('/api/v2/property')
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
        .post('/api/v2/property')
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
        .post('/api/v2/property')
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
        .post('/api/v2/property')
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
        .post('/api/v2/property')
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
        .post('/api/v2/property')
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
          expect(res.body.error).to.be.equal('Invalid state provided. Valid example: Lagos State');
          done();
        });
    });
    it('Should return an error if the city is not valid', (done) => {
      chai
        .request(app)
        .post('/api/v2/property')
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
          expect(res.body.error).to.be.equal('Invalid city provided. Make sure the city is in the state selected');
          done();
        });
    });
    it('Should return an error if the property type is not valid', (done) => {
      chai
        .request(app)
        .post('/api/v2/property')
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
          expect(res.body.error).to.be.equal('Invalid property type selected. A valid property type is either 2 Bedroom, 3 Bedroom, Land, or a Semi-detached duplex');
          done();
        });
    });
    it('Should return an error if the address is less than 7 characters', (done) => {
      chai
        .request(app)
        .post('/api/v2/property')
        .set('x-access-token', adminToken)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .attach('image', fs.readFileSync(filePath), 'deborah-cortelazzi-615800-unsplash_opt.jpg')
        .field('state', 'Lagos State')
        .field('city', 'Alimosho')
        .field('price', 60000000.50)
        .field('address', '67')
        .field('type', 'Land')
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body.error).to.be.equal('Invalid address provided. A valid address is at least seven characters long');
          done();
        });
    });
    it('Should return an error if the price is not valid', (done) => {
      chai
        .request(app)
        .post('/api/v2/property')
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
  describe('POST api/v1/property', () => {
    const filePath = `${__dirname}/imageFolder/deborah-cortelazzi-615800-unsplash_opt.jpg`;
    it('Should list a new property if all checks are fine', (done) => {
      chai
        .request(app)
        .post('/api/v1/property')
        .set('x-access-token', adminTokenDb)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .attach('image', filePath)
        .field('state', 'Lagos State')
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
        .set('x-access-token', adminToken)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .field('state', 'Lagos State')
        .field('city', 'Alimosho')
        .field('price', 60000000.50)
        .field('address', '33 Bashorun drive')
        .field('type', 'Land')
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.status).to.be.equal('success');
          expect(res.body.data).to.have.key('id', 'owner', 'status', 'price', 'state', 'city', 'address', 'type',
            'createdOn', 'imageUrl');
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
      const id = 1;
      chai
        .request(app)
        .patch(`/api/v2/property/${id}`)
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
          expect(res).to.have.status(403);
          expect(res.body.status).to.be.equal(403);
          expect(res.body.error).to.be.equal('You are not authorized to view this resource');
          done();
        });
    });
    it('Should return an error if the property with the requested id does not exist', (done) => {
      const id = 44;
      chai
        .request(app)
        .patch(`/api/v2/property/${id}`)
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
          expect(res).to.have.status(404);
          expect(res.body.status).to.be.equal(404);
          expect(res.body.error).to.be.equal('Property with the specified id not found');
          done();
        });
    });
    it('Should return an error if the price to update is not a valid price', (done) => {
      const id = 1;
      chai
        .request(app)
        .patch(`/api/v2/property/${id}`)
        .set('x-access-token', adminToken)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .field('state', 'Lagos State')
        .field('city', 'Alimosho')
        .field('price', 'price')
        .field('address', '67 Bamgboye close')
        .field('type', 'Land')
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body.error).to.be.equal('Invalid price provided');
          done();
        });
    });
    it('Should return an error if the property type to update is not a valid type', (done) => {
      const id = 1;
      chai
        .request(app)
        .patch(`/api/v2/property/${id}`)
        .set('x-access-token', adminToken)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .field('state', 'Lagos State')
        .field('city', 'Alimosho')
        .field('price', 50000.50)
        .field('address', '67 Bamgboye close')
        .field('type', 'Invalid Property Type')
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body.error).to.be.equal('Invalid property type selected. A valid property type is either 2 Bedroom, 3 Bedroom, Land, or a Semi-detached duplex');
          done();
        });
    });
    it('Should return an error if an agent wants to update a city without updating a state', (done) => {
      const id = 1;
      chai
        .request(app)
        .patch(`/api/v2/property/${id}`)
        .set('x-access-token', adminToken)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .field('city', 'Mushin')
        .field('price', 60000000.50)
        .field('address', '67 Bamgboye close')
        .field('type', 'Land')
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body.error).to.be.equal('Invalid, select a state to continue');
          done();
        });
    });
    it('Should return an error if an agent wants to update a state without updating the city', (done) => {
      const id = 1;
      chai
        .request(app)
        .patch(`/api/v2/property/${id}`)
        .set('x-access-token', adminToken)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .field('state', 'Lagos State')
        .field('price', 60000000.50)
        .field('address', '67 Bamgboye close')
        .field('type', 'Land')
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body.error).to.be.equal('Invalid, select a city to continue');
          done();
        });
    });
    it('Should return an error if the state to update does not exist', (done) => {
      const id = 1;
      chai
        .request(app)
        .patch(`/api/v2/property/${id}`)
        .set('x-access-token', adminToken)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .field('state', 'Washingtom DC')
        .field('city', 'Alimosho')
        .field('price', 60000000.50)
        .field('address', '67 Bamgboye close')
        .field('type', 'Land')
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body.error).to.be.equal('Invalid state provided. Valid example: Lagos State');
          done();
        });
    });
    it('Should return an error if the city to update is not in the state provided', (done) => {
      const id = 1;
      chai
        .request(app)
        .patch(`/api/v2/property/${id}`)
        .set('x-access-token', adminToken)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .field('state', 'Lagos State')
        .field('city', 'Barcelona')
        .field('price', 60000000.50)
        .field('address', '67 Bamgboye close')
        .field('type', 'Land')
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body.error).to.be.equal('Invalid city provided. Make sure the city is in the state selected');
          done();
        });
    });
    it('Should return an error if the agent adds an invalid address', (done) => {
      const id = 1;
      chai
        .request(app)
        .patch(`/api/v2/property/${id}`)
        .set('x-access-token', adminToken)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .field('state', 'Lagos State')
        .field('city', 'Alimosho')
        .field('price', 60000000.50)
        .field('address', 'No')
        .field('type', 'Land')
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body.error).to.be.equal('Invalid address provided. A valid address is at least seven characters long');
          done();
        });
    });
    it('Should return an error if the agent wants to update the details of another agent\'s property', (done) => {
      const id = 6;
      chai
        .request(app)
        .patch(`/api/v2/property/${id}`)
        .set('x-access-token', adminToken)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .field('state', 'Lagos State')
        .field('city', 'Alimosho')
        .field('price', 60000000.50)
        .field('address', '67, Bambgoye close')
        .field('type', 'Land')
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body.status).to.be.equal(403);
          expect(res.body.error).to.be.equal('You are not authorized to view this resource');
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
        .field('type', 'Land')
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.status).to.be.equal('success');
          expect(res.body.data).to.have.key('id', 'owner', 'status', 'price', 'state', 'city', 'address', 'type',
            'created_on', 'image_url');
          done();
        });
    });
    it('Should return an error if the property with the requested id does not exist', (done) => {
      const id = 1000;
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
          expect(res.body.status).to.be.equal(404);
          expect(res.body.error).to.be.equal('Property with the provided id not found');
          done();
        });
    });
    it('Should return an error if the agent wants to update the details of another agent\'s property', (done) => {
      const id = 14;
      chai
        .request(app)
        .patch(`/api/v1/property/${id}`)
        .set('x-access-token', adminTokenDb)
        .set('enctype', 'multipart/formdata')
        .type('form')
        .field('state', 'Lagos State')
        .field('city', 'Alimosho')
        .field('price', 60000000.50)
        .field('address', '67, Bambgoye close')
        .field('type', 'Land')
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body.status).to.be.equal(403);
          expect(res.body.error).to.be.equal('You are not permitted to view this resource');
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
        .set('x-access-token', adminToken)
        .send({
          status: 'Sold',
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.status).to.be.equal('success');
          expect(res.body.data).to.have.key('id', 'owner', 'status', 'price', 'state', 'city', 'address', 'type',
            'createdOn', 'imageUrl');
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
          expect(res.body.status).to.be.equal(401);
          expect(res.body.error).to.be.equal('You do not have access to this resource');
          done();
        });
    });
    it('Should return an error if a user wants to mark a property as sold', (done) => {
      const id = 1;
      chai
        .request(app)
        .patch(`/api/v2/property/${id}/sold`)
        .set('x-access-token', userToken)
        .send({
          status: 'Sold',
        })
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body.status).to.be.equal(403);
          expect(res.body.error).to.be.equal('You are not authorized to view this resource');
          done();
        });
    });
    it('Should return an error if an agent with the requesting id does not exist', (done) => {
      const id = 44;
      chai
        .request(app)
        .patch(`/api/v2/property/${id}/sold`)
        .set('x-access-token', adminToken)
        .send({
          status: 'Sold',
        })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.status).to.be.equal(404);
          expect(res.body.error).to.be.equal('Property with the specified id not found');
          done();
        });
    });
    it('Should return an error if the agent wants to update the details of another agent\'s property', (done) => {
      const id = 6;
      chai
        .request(app)
        .patch(`/api/v2/property/${id}/sold`)
        .set('x-access-token', adminToken)
        .send({
          status: 'Sold',
        })
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body.status).to.be.equal(403);
          expect(res.body.error).to.be.equal('You are not authorized to view this resource');
          done();
        });
    });
    it('Should return an error if the user puts in a wrong value as status', (done) => {
      const id = 1;
      chai
        .request(app)
        .patch(`/api/v2/property/${id}/sold`)
        .set('x-access-token', adminToken)
        .send({
          status: 'Awaiting',
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
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
        .set('x-access-token', adminToken)
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
          expect(res.body.status).to.be.equal(401);
          expect(res.body.error).to.be.equal('You do not have access to this resource');
          done();
        });
    });
    it('Should return an error if a user wants to mark a property as sold', (done) => {
      const id = 1;
      chai
        .request(app)
        .delete(`/api/v2/property/${id}`)
        .set('x-access-token', userToken)
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body.status).to.be.equal(403);
          expect(res.body.error).to.be.equal('You are not authorized to view this resource');
          done();
        });
    });
    it('Should return an error if a property with the requesting id does not exist', (done) => {
      const id = 44;
      chai
        .request(app)
        .delete(`/api/v2/property/${id}`)
        .set('x-access-token', adminToken)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.status).to.be.equal(404);
          expect(res.body.error).to.be.equal('Property with the specified id not found');
          done();
        });
    });
    it('Should return an error if the agent wants to delete a property not listed by him/her', (done) => {
      const id = 6;
      chai
        .request(app)
        .delete(`/api/v2/property/${id}`)
        .set('x-access-token', adminToken)
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body.status).to.be.equal(403);
          expect(res.body.error).to.be.equal('You are not authorized to view this resource');
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
        .set('x-access-token', adminToken)
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
          expect(res.body.status).to.be.equal(401);
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
        .set('x-access-token', adminToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.be.equal('success');
          expect(res.body.data).to.be.an('array');
          done();
        });
    });
  });
  describe('GET api/v1/property?type=<propertyType>', () => {
    it('Should return an arfray of all listed properties', (done) => {
      chai
        .request(app)
        .get('/api/v2/property?type=Land')
        .set('x-access-token', adminToken)
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
        .set('x-access-token', adminToken)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.status).to.be.equal(404);
          expect(res.body.error).to.be.equal('No property with the specified type');
          done();
        });
    });
  });
  describe('GET api/v1/property/:id', () => {
    it('Should return an arrray of a particular property if the id exists', (done) => {
      chai
        .request(app)
        .get('/api/v2/property/1')
        .set('x-access-token', adminToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.be.equal('success');
          expect(res.body.data).to.be.an('array');
          done();
        });
    });
  });
});
