/* eslint-disable no-undef */
import chai from 'chai';

import faker from 'faker';

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
          email: faker.internet.email(),
          first_name: faker.name.firstName(),
          last_name: faker.name.lastName(),
          password: 'fegzycole',
          phone_number: '07057575757',
          address: '90, Herder\'s Ranch, Kafanchan, Kaduna',
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.status).to.be.equal('success');
          expect(res.body.data).to.have.key('token', 'id', 'first_name', 'last_name', 'email');
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
          first_name: 'zinedine',
          last_name: 'zidane',
          password: 'manforthejob',
          phone_number: '07057575757',
          address: '90, Herder\'s Ranch, Kafanchan, Kaduna',
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.equal('Invalid email provided');
          done();
        });
    });
    it('Should return an error if the user provides a password less than 6 characters', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'zizzou104@gmail.com',
          first_name: 'zinedine',
          last_name: 'zidane',
          password: 'manfo',
          phone_number: '07057575757',
          address: '90, Herder\'s Ranch, Kafanchan, Kaduna',
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.equal('Invalid password provided. A valid password is at least six characters long');
          done();
        });
    });
    it('Should return an error if the user provides a first name with a space in-between', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'zizzou104@gmail.com',
          first_name: 'zine dine',
          last_name: 'zidane',
          password: 'manforthejob',
          phone_number: '07057575757',
          address: '90, Herder\'s Ranch, Kafanchan, Kaduna',
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.equal('Invalid first name provided');
          done(err);
        });
    });
    it('Should return an error if the user provides a last name with a space in-between', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'zizzou104@gmail.com',
          first_name: 'zinedine',
          last_name: 'zida ne',
          password: 'manforthejob',
          phone_number: '07057575757',
          address: '90, Herder\'s Ranch, Kafanchan, Kaduna',
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.equal('Invalid last name provided');
          done();
        });
    });
    it('Should return an error if the Phone Number is not a valid phone number', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'zizzou104@gmail.com',
          first_name: 'zinedine',
          last_name: 'zidane',
          password: 'manforthejob',
          phone_number: 'hellothere',
          address: '90, Herder\'s Ranch, Kafanchan, Kaduna',
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.equal('Invalid phone number provided. A valid phone number is 07057154456');
          done();
        });
    });
    it('Should return an error if the address provided is less than 7 characters', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'zizzou104@gmail.com',
          first_name: 'zinedine',
          last_name: 'zidane',
          password: 'manforthejob',
          phone_number: '07057575757',
          address: '90',
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.equal('Invalid address provided. A valid address is at least seven characters long');
          done();
        });
    });
    it('Should return an error if the user provides no email', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          first_name: 'zinedine',
          last_name: 'zidane',
          password: 'manforthejob',
          phone_number: '07057575757',
          address: '90, Herder\'s Ranch, Kafanchan, Kaduna',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal('error');
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
          last_name: 'zidane',
          password: 'manforthejob',
          phone_number: '07057575757',
          address: '90, Herder\'s Ranch, Kafanchan, Kaduna',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal('error');
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
          first_ame: 'zinedine',
          password: 'manforthejob',
          phone_number: '07057575757',
          address: '90, Herder\'s Ranch, Kafanchan, Kaduna',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal('error');
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
          first_name: 'zinedine',
          last_name: 'zidane',
          phone_number: '07057575757',
          address: '90, Herder\'s Ranch, Kafanchan, Kaduna',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal('error');
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
          first_name: 'zinedine',
          last_name: 'zidane',
          password: 'manforthejob',
          address: '90, Herder\'s Ranch, Kafanchan, Kaduna',
          type: 'agent',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal('error');
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
          first_name: 'zinedine',
          last_name: 'zidane',
          password: 'manforthejob',
          phone_number: '07057575757',
          address: '',
          type: 'agent',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.equal('Address cannot be left empty');
          done();
        });
    });
    it('Should return an error if the user puts in an email that already exists ', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'fergusoniyara@gmail.com',
          first_name: 'zinedine',
          last_name: 'zidane',
          password: 'manforthejob',
          phone_number: '07057154467',
          address: '90, Herder\'s Ranch, Kafanchan, Kaduna',
        })
        .end((err, res) => {
          expect(res).to.have.status(409);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.equal('Email already exists');
          done();
        });
    });
  });
  describe('POST api/v2/auth/signup', () => {
    it('Should successfully sign up a user and return a token', (done) => {
      chai
        .request(app)
        .post('/api/v2/auth/signup')
        .send({
          email: 'zizzou104@gmail.com',
          first_name: 'zinedine',
          last_name: 'zidane',
          password: 'manforthejob',
          phone_number: '07057575757',
          address: '90, Herder\'s Ranch, Kafanchan, Kaduna',
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.status).to.be.equal('success');
          expect(res.body.data).to.have.key('token', 'id', 'first_name', 'last_name', 'email');
          expect(res.body.data.token).to.be.a('string');
          done();
        });
    });
  });
  describe('POST api/v2/auth/signin', () => {
    it('Should successfully sign in a user and return a token', (done) => {
      chai
        .request(app)
        .post('/api/v2/auth/signin')
        .send({
          email: 'fergusoniyara@gmail.com',
          password: 'somepassword',
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.be.equal('success');
          expect(res.body.data).to.have.key('token', 'id', 'first_name', 'last_name', 'email');
          expect(res.body.data.token).to.be.a('string');
          done();
        });
    });
    it('Should return an error if the user provides no email', (done) => {
      chai
        .request(app)
        .post('/api/v2/auth/signin')
        .send({
          password: 'manforthejob',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.equal('email cannot be left empty');
          done();
        });
    });
    it('Should return an error if the user provides no password', (done) => {
      chai
        .request(app)
        .post('/api/v2/auth/signin')
        .send({
          email: 'fergusoniyara@gmail.com',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.equal('password cannot be left empty');
          done();
        });
    });
    it('Should return an error if the user provides wrong login credentials', (done) => {
      chai
        .request(app)
        .post('/api/v2/auth/signin')
        .send({
          email: 'wrong@gmail.com',
          password: 'wrongpassword',
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.equal('Email or password incorrect');
          done();
        });
    });
    it('Should return an error if the user provides a wrong password', (done) => {
      chai
        .request(app)
        .post('/api/v2/auth/signin')
        .send({
          email: 'fergusoniyara@gmail.com',
          password: 'manforthejob',
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.equal('Email or password incorrect');
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
          expect(res.body.data).to.have.key('token', 'id', 'first_name', 'last_name', 'email', 'is_admin');
          expect(res.body.data.token).to.be.a('string');
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
          expect(res).to.have.status(401);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.equal('Authorization failed. Email or password incorrect');
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
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.equal('Authorization failed. Email or password incorrect');
          done();
        });
    });
  });
  describe('POST api/v1/auth/<:email>/reset_password', () => {
    const email = 'iyaraferguson@gmail.com';
    it('Should successfully reset a user\'s password', (done) => {
      chai
        .request(app)
        .post(`/api/v1/auth/${email}/reset_password`)
        .send({
          password: 'minima',
          new_password: 'manforthejob',
        })
        .end((err, res) => {
          expect(res).to.have.status(204);
          done();
        });
    });
    it('Should return an error if the wants to reset his password but doesn\'t provide the existing password', (done) => {
      chai
        .request(app)
        .post(`/api/v1/auth/${email}/reset_password`)
        .send({
          new_password: 'manforthejob',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.equal('specify your old password to proceed');
          done();
        });
    });
    it('Should return an error if the wants to reset his password but doesn\'t provide a new password', (done) => {
      chai
        .request(app)
        .post(`/api/v1/auth/${email}/reset_password`)
        .send({
          password: 'manforthejob',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.equal('specify a new password to proceed');
          done();
        });
    });
    it('Should successfully reset an error if the new password is less than 6 characters', (done) => {
      chai
        .request(app)
        .post(`/api/v1/auth/${email}/reset_password`)
        .send({
          password: 'manforthejob',
          new_password: 'man',
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.equal('New password must be at least 6 characters long');
          done();
        });
    });
    it('Should return an error if the old password specified doesn\'t match what is in the database', (done) => {
      chai
        .request(app)
        .post(`/api/v1/auth/${email}/reset_password`)
        .send({
          password: 'wrongpassword',
          new_password: 'manforthejob',
        })
        .end((err, res) => {
          expect(res).to.have.status(409);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.equal('The password specified is not the same as what is saved in the database');
          done();
        });
    });
    it('Should return an error if the old password is the same as the new password', (done) => {
      chai
        .request(app)
        .post(`/api/v1/auth/${email}/reset_password`)
        .send({
          password: 'manforthejob',
          new_password: 'manforthejob',
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.equal('The new password cannot be the same as the old one');
          done();
        });
    });
    it('Should return an error if the email does not exist', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/unknownemail@gmail.com/reset_password')
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.status).to.be.equal('error');
          expect(res.body.error).to.be.equal('Email does not exist');
          done();
        });
    });
    it('Should successfully reset a user\'s password', (done) => {
      chai
        .request(app)
        .post(`/api/v1/auth/${email}/reset_password`)
        .send({
          password: 'manforthejob',
          new_password: 'minima',
        })
        .end((err, res) => {
          expect(res).to.have.status(204);
          done();
        });
    });
    it('Should successfully reset a user\'s password', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/fergieiyara@gmail.com/reset_password')
        .end((err, res) => {
          expect(res).to.have.status(204);
          done();
        });
    });
  });
});
