import chai from 'chai';
import chaiHttp from 'chai-http';
import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
import app from '../app';
import auth from '../authentication/auth';


dotenv.config();
const { secretKey } = process.env;

const email = 'chuku.omoke@gmail.com';
const verifiedRoutes = `/api/v1/users/${email}/verify`;

chai.should();
chai.use(chaiHttp);


// Unit test for requests made to API Endpoints for signin
describe('Signin Test', () => {
  describe('POST Request to /api/v1/auth/signin', () => {
    it('Should sign registered user in', (done) => {
      const user = {
        email: 'chuku.omoke@gmail.com',
        password: 'password',
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
          res.body.should.have.property('data');
          done();
        });
    });

    describe('POST to signup', () => {
      it('should throw a 409 error if the email is already taken', (done) => {
        const user = {
          email: 'chuku.omoke@gmail.com',
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


// Unit test for requests made to Enpoint for marking user as verified
describe('Marking a user as verified', () => {
  const credentials = {
    email: 'omoke@admin.com',
    isAdmin: true,
  };
  const token = auth.generateToken(credentials);
  it('Should allow admin to successfully verify a user', (done) => {
    chai.request(app)
      .patch(verifiedRoutes)
      .set('Authorization', token)
      .send(credentials)
      .end((err, res) => {
        console.log(res.body);
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        done();
      });
  });

  it('Should not verify a user when the email provided is not an admin', (done) => {
    chai.request(app)
      .patch(verifiedRoutes)
      .set('Authorization', token)
      .send({
        email: 'omoke@admin.com',
        password: 'password',
      })
      .end((err, res) => {
        res.should.have.status(401);
        res.should.be.an('object');
        res.body.should.have.property('status');
        res.body.should.have.property('error');
        done();
      });
  });

  it('Should not verify a user with invalid inputs', (done) => {
    chai.request(app)
      .patch(verifiedRoutes)
      .set('Authorization', token)
      .send({
        email: 'helloeld',
        password: 'ed',
      })
      .end((err, res) => {
        res.should.have.status(401);
        res.should.be.an('object');
        res.body.should.have.property('error');
        done();
      });
  });
});
