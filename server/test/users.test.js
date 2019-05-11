import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.should();
chai.use(chaiHttp);


// Unit test for requests made to API Endpoints for signin

describe('Signin Test', () => {
  describe('POST Request to /api/v1/auth/signin', () => {
    it('Should sign registered user in', (done) => {
      const user = {
        email: 'chuk.omoke@gmail.com',
        password: 'password2',
      };
      chai
        .request(app)
        .post('/api/v1/auth/signin')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
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
          res.should.be.a('object');
          res.body.should.have.property('error');
          done();
        });
    });

    it('Should not login user when password is incorrect', (done) => {
      const user = {
        email: 'chuk.omoke@gmail.com',
        password: 'passsss',
      };
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error');
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
          done();
        });
    });
  });
});

// Unit test for requests made to Api Endpoint for signup
describe('Signup Test', () => {
  describe('POST Request to /api/v1/auth/signup', () => {
    it('should be able to signup valid users', (done) => {
      const user = {
        email: 'chalu.philips@gmail.com',
        firstName: 'Chalu',
        lastName: 'Philips',
        password: 'chaluphilips',
        address: 'Epic tower online',
      };
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.an('object');
          // res.body.should.have.property('status').eql(201);
          res.body.should.have.property('userDetails');
          done();
        });
    });

    describe('POST to signup', () => {
      it('should throw a 409 error if the email is already taken', (done) => {
        const user = {
          email: 'chuk.omoke@gmail.com',
          firstName: 'Omoke',
          lastName: 'Chuku',
          password: 'pijkjkhk',
          address: 'Epic Tower Nigeria',
        };
        chai.request(app)
          .post('/api/v1/auth/signup')
          .send(user)
          .end((err, res) => {
            res.should.have.status(409);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            done();
          });
      });
      it('should throw a 400 error if firstName is not a string', (done) => {
        const user = {
          email: 'omoke.david@gmail.com',
          firstName: 234,
          lastName: 'david',
          password: 'davidomoke',
          address: 'I live somewhere sha',
        };
        chai.request(app)
          .post('/api/v1/auth/signup')
          .send(user)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            done();
          });
      });
      it('should throw a 400 error if lastName is not a string', (done) => {
        const user = {
          email: 'omoke.david@gmail.com',
          firstName: 'david',
          lastName: 456,
          password: 'omokdavo',
          address: 'My address is my address',
        };
        chai.request(app)
          .post('/api/v1/auth/signup')
          .send(user)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            done();
          });
      });
      it('should throw a 400 error if email is not inputed', (done) => {
        const user = {
          firstName: 'Ogachalu',
          lastName: 'Ogaphilips',
          password: 'chalu234',
          address: 'Epic Tower Rwanda',
        };
        chai.request(app)
          .post('/api/v1/auth/signup')
          .send(user)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            done();
          });
      });
      it('should throw a 400 error if firstName is not inputed', (done) => {
        const user = {
          email: 'ogachalu.philips@gmail.com',
          lastName: 'Ogaphilips',
          password: 'chalu234',
          address: 'Epic Tower Kigali',
        };
        chai.request(app)
          .post('/api/v1/auth/signup')
          .send(user)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            done();
          });
      });
      it('should throw a 400 error if lastName is not inputed', (done) => {
        const user = {
          email: 'ogachalu.philips2@gmail.com',
          firstName: 'Ogachal',
          password: 'chalu234',
          address: 'Epic Tower Oshodi',
        };
        chai.request(app)
          .post('/api/v1/auth/signup')
          .send(user)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            done();
          });
      });
      it('should throw a 400 error if password is not inputed', (done) => {
        const user = {
          email: 'wejem@gmail.com',
          firstName: 'Emmanuel',
          lastName: 'Weje',
          address: 'Kolex bustop yaba',
        };
        chai.request(app)
          .post('/api/v1/auth/signup')
          .send(user)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            done();
          });
      });
      it('should throw a 400 error if address is not inputed', (done) => {
        const user = {
          email: 'ikechuku.samuel@gmail.com',
          firstName: 'Ikechuku',
          lastName: 'Samuel',
          password: 'iksamuel',
        };
        chai.request(app)
          .post('/api/v1/auth/signup')
          .send(user)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            done();
          });
      });
      it('should throw a 400 error if the firstName is less than 3 alphabets', (done) => {
        const user = {
          email: 'hello@world.com',
          firstName: 'he',
          lastName: 'world',
          password: 'hdididdh',
          address: 'I live in the world',
        };
        chai
          .request(app)
          .post('/api/v1/auth/signup')
          .send(user)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            done();
          });
      });
      it('should throw a 400 error if the lastName is less than 3 alphabets', (done) => {
        const user = {
          email: 'hello22@world.com',
          firstName: 'hello',
          lastName: 'wo',
          password: 'jdhddsls',
          address: 'I live in your repo sometimes',
        };
        chai
          .request(app)
          .post('/api/v1/auth/signup')
          .send(user)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            done();
          });
      });
      it('should throw an error if the password is less than 7 characters', (done) => {
        const user = {
          email: 'helpmeo@idontire.com',
          firstName: 'butcode',
          lastName: 'sweettowrite',
          password: 'hdhd',
          address: 'Ojuelegba lagos island',
        };
        chai
          .request(app)
          .post('/api/v1/auth/signup')
          .send(user)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            done();
          });
      });

      it('should throw an error if address is less than 10 characters', (done) => {
        const user = {
          email: 'okay@finally.com',
          firstName: 'lastone',
          lastName: 'ipromise',
          password: 'jdjdjdjd',
          address: 'oshodi',
        };
        chai.request(app)
          .post('/api/v1/auth/signup')
          .send(user)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            done();
          });
      });
    });
  });
});
