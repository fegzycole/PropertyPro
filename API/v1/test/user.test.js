/* eslint-disable no-undef */
import chai from 'chai';

import chaiHttp from 'chai-http';

import app from '../../index';

const { expect } = chai;

chai.use(chaiHttp);

describe('Tests for all Auth(signup and signin) Endpoints', () => {
  describe('POST api/v1/auth/signup', () => {
    it('Should successfully sign up a user and return a token', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'zizzou104@gmail.com',
          firstName: 'zinedine',
          lastName: 'zidane',
          password: 'manforthejob',
          phoneNumber: '07057575757',
          address: '90, Herder\'s Ranch, Kafanchan, Kaduna',
          type: 'agent',
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.status).to.be.equal('success');
          expect(res.body.data).to.have.key('token', 'id', 'firstName', 'lastName', 'email', 'isAdmin');
          expect(res.body.data.token).to.be.a('string');
          done();
        });
    });
    it('Should return an error if the user provides an invalid email', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'zizzou104',
          firstName: 'zinedine',
          lastName: 'zidane',
          password: 'manforthejob',
          phoneNumber: '07057575757',
          address: '90, Herder\'s Ranch, Kafanchan, Kaduna',
          type: 'agent',
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body.error).to.be.equal('Invalid Email provided');
          done();
        });
    });
    it('Should return an error if the user provides an invalid password', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'zizzou104@gmail.com',
          firstName: 'zinedine',
          lastName: 'zidane',
          password: 'manfo rthejob',
          phoneNumber: '07057575757',
          address: '90, Herder\'s Ranch, Kafanchan, Kaduna',
          type: 'agent',
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body.error).to.be.equal('Invalid Password provided');
          done();
        });
    });
    it('Should return an error if the user provides a first name with a space in-between', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'zizzou104@gmail.com',
          firstName: 'zine dine',
          lastName: 'zidane',
          password: 'manforthejob',
          phoneNumber: '07057575757',
          address: '90, Herder\'s Ranch, Kafanchan, Kaduna',
          type: 'agent',
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body.error).to.be.equal('Invalid First Name provided');
          done(err);
        });
    });
    it('Should return an error if the user provides a last name with a space in-between', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'zizzou104@gmail.com',
          firstName: 'zinedine',
          lastName: 'zida ne',
          password: 'manforthejob',
          phoneNumber: '07057575757',
          address: '90, Herder\'s Ranch, Kafanchan, Kaduna',
          type: 'agent',
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body.error).to.be.equal('Invalid Last Name provided');
          done();
        });
    });
    it('Should return an error if the Phone Number is not a valid phone number', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'zizzou104@gmail.com',
          firstName: 'zinedine',
          lastName: 'zidane',
          password: 'manforthejob',
          phoneNumber: 'hellothere',
          address: '90, Herder\'s Ranch, Kafanchan, Kaduna',
          type: 'agent',
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body.error).to.be.equal('Invalid Phone Number provided');
          done();
        });
    });
    it('Should return an error if the type provided is neither  a user or an agent ', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'zizzou104@gmail.com',
          firstName: 'zinedine',
          lastName: 'zidane',
          password: 'manforthejob',
          phoneNumber: '07057154467',
          address: '90, Herder\'s Ranch, Kafanchan, Kaduna',
          type: 'manager',
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body.error).to.be.equal('Only Agent or User allowed');
          done();
        });
    });
    it('Should return an error if the user provides no email', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          firstName: 'zinedine',
          lastName: 'zidane',
          password: 'manforthejob',
          phoneNumber: '07057575757',
          address: '90, Herder\'s Ranch, Kafanchan, Kaduna',
          type: 'agent',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body.error).to.be.equal('Email cannot be left empty');
          done();
        });
    });
    it('Should return an error if the user provides no first name', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'zizzou104@gmail.com',
          lastName: 'zidane',
          password: 'manforthejob',
          phoneNumber: '07057575757',
          address: '90, Herder\'s Ranch, Kafanchan, Kaduna',
          type: 'agent',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body.error).to.be.equal('First Name/Last Name cannot be left empty');
          done();
        });
    });
    it('Should return an error if the user provides no last name', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'zizzou104@gmail.com',
          firstName: 'zinedine',
          password: 'manforthejob',
          phoneNumber: '07057575757',
          address: '90, Herder\'s Ranch, Kafanchan, Kaduna',
          type: 'agent',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body.error).to.be.equal('First Name/Last Name cannot be left empty');
          done();
        });
    });
    it('Should return an error if the user provides no password', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'zizzou104@gmail.com',
          firstName: 'zinedine',
          lastName: 'zidane',
          phoneNumber: '07057575757',
          address: '90, Herder\'s Ranch, Kafanchan, Kaduna',
          type: 'agent',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body.error).to.be.equal('Password cannot be left empty');
          done();
        });
    });
    it('Should return an error if the user provides no phone number', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'zizzou104@gmail.com',
          firstName: 'zinedine',
          lastName: 'zidane',
          password: 'manforthejob',
          address: '90, Herder\'s Ranch, Kafanchan, Kaduna',
          type: 'agent',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body.error).to.be.equal('Phone Number cannot be left empty');
          done();
        });
    });
    it('Should return an error if the user provides no address', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'zizzou104@gmail.com',
          firstName: 'zinedine',
          lastName: 'zidane',
          password: 'manforthejob',
          phoneNumber: '07057575757',
          address: '',
          type: 'agent',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body.error).to.be.equal('Address cannot be left empty');
          done();
        });
    });
    it('Should return an error if the user provides no user type', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'zizzou104@gmail.com',
          firstName: 'zinedine',
          lastName: 'zidane',
          password: 'manforthejob',
          phoneNumber: '07057575757',
          address: '90, Herder\'s Ranch, Kafanchan, Kaduna',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body.error).to.be.equal('Type cannot be left empty');
          done();
        });
    });
  });
  describe('POST api/v1/auth/signin', () => {
    it('Should successfully sign in a user and return a token', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: 'fergusoniyara@gmail.com',
          password: 'somepassword',
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.be.equal('success');
          expect(res.body.data).to.have.key('token', 'id', 'firstName', 'lastName', 'email', 'isAdmin');
          expect(res.body.data.token).to.be.a('string');
          done();
        });
    });
    it('Should return an error if the user provides no email', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signin')
        .send({
          password: 'manforthejob',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body.error).to.be.equal('email cannot be left empty');
          done();
        });
    });
    it('Should return an error if the user provides no password', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: 'fergusoniyara@gmail.com',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body.error).to.be.equal('password cannot be left empty');
          done();
        });
    });
    it('Should return an error if the user provides wrong login credentials', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: 'wrong@gmail.com',
          password: 'wrongpassword',
        })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.status).to.be.equal(404);
          expect(res.body.error).to.be.equal('Email does not exist');
          done();
        });
    });
    it('Should return an error if the user provides a wrong password', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: 'fergusoniyara@gmail.com',
          password: 'manforthejob',
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.status).to.be.equal(401);
          expect(res.body.error).to.be.equal('Authentication Failed');
          done();
        });
    });
  });
});
