import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.should();
chai.use(chaiHttp);


// Unit test for requests made to API Endpoints for signin

describe('Signin Test', () => {
  describe('POST Request to /api/v1/auth/signin', () => {
    it('Should login all valid users', (done) => {
      const user = {
        email: 'chuku.omoke@gmail.com',
        password: 'omokedavid',
      };
      chai
        .request(app)
        .post('/api/v1/auth/signin')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.data.should.have.property('isAdmin');
          res.body.data.should.have.property('token');
          res.body.data.should.have.property('status');
          res.body.should.have.property('data');
          done();
        });
    });

    it('Should not login user when email is not registered', (done) => {
      const user = {
        email: 'omoke.chuku@gmail.com',
        password: 'helpmeoo',
      };
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.an('object');
          res.body.should.have.property('error');
          res.body.error.should.have.be.eql('Incorrect email or password');
          done();
        });
    });

    it('Should not login user when password is incorrect', (done) => {
      const user = {
        email: 'chuku.omoke@gmail.com',
        password: 'omokeda',
      };
      chai.request(app)
        .post('api/v1/auth/signin')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.be.eql('Invalid Email or Password Inputed!');
          done();
        });
    });

    it('Should return 400  if Email field is omitted', (done) => {
      const user = {
        password: 'omokedavid',
      };
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.be.eql('Email field should not be empty');
          done();
        });
    });

    it('Should return 400  if Password field is omitted', (done) => {
      const user = {
        email: 'chuku.omoke@gmail.com',
      };
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.be.eql('Password field should not be empty');
          done();
        });
    });
  });
});
