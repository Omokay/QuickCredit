/* eslint-disable no-unused-vars */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import {
  ommittedFirstName, ommittedEmail, ommittedLastName, ommittedTenor, invalidFirstNameLength,
  invalidLastNameLength, invalidFirstNameCharacter, insufficientAmount,
  invalidLastNameCharacter, correctUser, invalidAmount, insufficientTenor, exceedTenor,
  invalidTenor, myAdmin, correctLoan, ommittedAmount,
} from './mockData';

chai.use(chaiHttp);

chai.should();


const url = '/api/v1/loans';
const loginUrl = '/api/v1/auth/signin';
const repaidUrl = '/api/v1/loans?status=approved&repaid=true';
const unrepaidUrl = '/api/v1/loans?status=approved&repaid=false';
const wrongStatusUrl = '/api/v1/loans?status=approve&repaid=true';
const wrongRepaidUrl = '/api/v1/loans?status=approved&repaid=good';
const wrongStatusType = '/api/v1/loans?status=1&repaid=true';
const wrongRepaidType = '/api/v1/loans?status=approved&repaid=1';
const loanId = 3;

// TEST FOR LOAN APPLICATION ROUTES
describe('Tests for Loan Endpoint', () => {
  describe(`POST ${url}`, () => {
    it('Should throw an error if token was not entered', (done) => {
      chai
        .request(app)
        .post(loginUrl)
        .send(myAdmin)
        .end((loginErr, loginRes) => {
          chai
            .request(app)
            .get(url)
            .end((err, res) => {
              res.should.have.status(401);
              res.body.should.be.a('object');
              res.body.should.have.property('error');
              res.body.error.should.be.eql('Invalid or No Token Provided');
              done();
            });
        });
    });

    it('Should create loan application successfully', (done) => {
      chai
        .request(app)
        .post(loginUrl)
        .send(correctUser)
        .end((loginErr, loginRes) => {
          const token = `Bearer ${loginRes.body.data.token}`;
          chai
            .request(app)
            .post(url)
            .set('authorization', token)
            .send(correctLoan)
            .end((err, res) => {
              console.log(res.body.error);
              res.body.should.be.a('object');
              res.should.have.status(201);
              res.body.should.have.property('data');
              done();
            });
        });
    });
  });

  it('Should throw error if email is omitted', (done) => {
    chai
      .request(app)
      .post(loginUrl)
      .send(correctUser)
      .end((loginErr, loginRes) => {
        const token = `Bearer ${loginRes.body.data.token}`;
        chai
          .request(app)
          .post(url)
          .set('authorization', token)
          .send(ommittedEmail)
          .end((err, res) => {
            res.body.should.be.a('object');
            res.should.have.status(400);
            res.body.should.have.property('error');
            res.body.error.should.eql('Email field is required');
            done();
          });
      });
  });
  it('Should throw error if First name Omitted', (done) => {
    chai
      .request(app)
      .post(loginUrl)
      .send(correctUser)
      .end((loginErr, loginRes) => {
        const token = `Bearer ${loginRes.body.data.token}`;
        chai
          .request(app)
          .post(url)
          .set('authorization', token)
          .send(ommittedFirstName)
          .end((err, res) => {
            console.log(err);
            res.body.should.be.a('object');
            res.should.have.status(400);
            res.body.should.have.property('error');
            res.body.error.should.eql('First name field is required');
            done();
          });
      });
  });
  it('Should throw error if First name is less than 3 characters', (done) => {
    chai
      .request(app)
      .post(loginUrl)
      .send(correctUser)
      .end((loginErr, loginRes) => {
        const token = `Bearer ${loginRes.body.data.token}`;
        chai
          .request(app)
          .post(url)
          .set('authorization', token)
          .send(invalidFirstNameLength)
          .end((err, res) => {
            res.body.should.be.a('object');
            res.should.have.status(400);
            res.body.should.have.property('error');
            res.body.error.should.eql('First name should be between 3 to 15 characters');
            done();
          });
      });
  });
  it('Should throw error if invalid First name is entered', (done) => {
    chai
      .request(app)
      .post(loginUrl)
      .send(correctUser)
      .end((loginErr, loginRes) => {
        const token = `Bearer ${loginRes.body.data.token}`;
        chai
          .request(app)
          .post(url)
          .set('authorization', token)
          .send(invalidFirstNameCharacter)
          .end((err, res) => {
            res.body.should.be.a('object');
            res.should.have.status(400);
            res.body.should.have.property('error');
            res.body.error.should.eql('First name should only contain alphabets');
            done();
          });
      });
  });
  it('Should throw error if invalid Last name is entered', (done) => {
    chai
      .request(app)
      .post(loginUrl)
      .send(correctUser)
      .end((loginErr, loginRes) => {
        const token = `Bearer ${loginRes.body.data.token}`;
        chai
          .request(app)
          .post(url)
          .set('authorization', token)
          .send(invalidLastNameCharacter)
          .end((err, res) => {
            res.body.should.be.a('object');
            res.should.have.status(400);
            res.body.should.have.property('error');
            res.body.error.should.eql('Last name should only contain alphabets');
            done();
          });
      });
  });
  it('Should throw error if Last name is less than 3 characters', (done) => {
    chai
      .request(app)
      .post(loginUrl)
      .send(correctUser)
      .end((loginErr, loginRes) => {
        const token = `Bearer ${loginRes.body.data.token}`;
        chai
          .request(app)
          .post(url)
          .set('authorization', token)
          .send(invalidLastNameLength)
          .end((err, res) => {
            res.body.should.be.a('object');
            res.should.have.status(400);
            res.body.should.have.property('error');
            res.body.error.should.eql('Last name should be between 3 to 15 characters');
            done();
          });
      });
  });
  it('Should throw error if Amount name is omitted', (done) => {
    chai
      .request(app)
      .post(loginUrl)
      .send(correctUser)
      .end((loginErr, loginRes) => {
        const token = `Bearer ${loginRes.body.data.token}`;
        chai
          .request(app)
          .post(url)
          .set('authorization', token)
          .send(ommittedAmount)
          .end((err, res) => {
            res.body.should.be.a('object');
            res.should.have.status(400);
            res.body.should.have.property('error');
            res.body.error.should.eql('Amount is required');
            done();
          });
      });
  });
  it('Should throw error if tenor is omitted', (done) => {
    chai
      .request(app)
      .post(loginUrl)
      .send(correctUser)
      .end((loginErr, loginRes) => {
        const token = `Bearer ${loginRes.body.data.token}`;
        chai
          .request(app)
          .post(url)
          .set('authorization', token)
          .send(ommittedTenor)
          .end((err, res) => {
            res.body.should.be.a('object');
            res.should.have.status(400);
            res.body.should.have.property('error');
            res.body.error.should.eql('tenor is required');
            done();
          });
      });
  });
  it('Should throw error if Last name is omitted', (done) => {
    chai
      .request(app)
      .post(loginUrl)
      .send(correctUser)
      .end((loginErr, loginRes) => {
        const token = `Bearer ${loginRes.body.data.token}`;
        chai
          .request(app)
          .post(url)
          .set('authorization', token)
          .send(ommittedLastName)
          .end((err, res) => {
            console.log(res.body.error);
            res.body.should.be.a('object');
            res.should.have.status(400);
            res.body.should.have.property('error');
            res.body.error.should.eql('Last name field is required');
            done();
          });
      });
  });
  it('Should throw error if Amount is not an integer', (done) => {
    chai
      .request(app)
      .post(loginUrl)
      .send(correctUser)
      .end((loginErr, loginRes) => {
        const token = `Bearer ${loginRes.body.data.token}`;
        chai
          .request(app)
          .post(url)
          .set('authorization', token)
          .send(invalidAmount)
          .end((err, res) => {
            res.body.should.be.a('object');
            res.should.have.status(400);
            res.body.should.have.property('error');
            res.body.error.should.eql('Amount should be an integer');
            done();
          });
      });
    it('Should throw error if Tenor is not an integer', (done) => {
      chai
        .request(app)
        .post(loginUrl)
        .send(correctUser)
        .end((loginErr, loginRes) => {
          const token = `Bearer ${loginRes.body.data.token}`;
          chai
            .request(app)
            .post(url)
            .set('authorization', token)
            .send(invalidTenor)
            .end((err, res) => {
              res.body.should.be.a('object');
              res.should.have.status(400);
              res.body.should.have.property('error');
              res.body.error.should.eql('tenor should be an integer');
              done();
            });
        });
      it('Should throw error if Amount is less than 10000', (done) => {
        chai
          .request(app)
          .post(loginUrl)
          .send(correctUser)
          .end((loginErr, loginRes) => {
            const token = `Bearer ${loginRes.body.data.token}`;
            chai
              .request(app)
              .post(url)
              .set('authorization', token)
              .send(insufficientAmount)
              .end((err, res) => {
                res.body.should.be.a('object');
                res.should.have.status(400);
                res.body.should.have.property('error');
                res.body.error.should.eql('Amount should not be less than 10,000');
                done();
              });
          });
      });
    });
  });
});

describe(`POST ${url}`, () => {
  it('Should throw error if user applies for loan more than once', (done) => {
    chai
      .request(app)
      .post(loginUrl)
      .send(correctUser)
      .end((loginErr, loginRes) => {
        const token = `Bearer ${loginRes.body.data.token}`;
        chai
          .request(app)
          .post(url)
          .set('authorization', token)
          .send(correctLoan)
          .end((err, res) => {
            chai
              .request(app)
              .post(url)
              .set('authorization', token)
              .send(correctLoan)
              .end((err, res) => {
                res.should.have.status(409);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.eql('You already applied for a loan!');
                done();
              });
          });
      });
  });
});

// TEST TO GET LOAN APPLICATIONS
describe(`GET ${url}`, () => {
  it('Should return all loan applications', (done) => {
    chai
      .request(app)
      .post(loginUrl)
      .send(myAdmin)
      .end((loginErr, loginRes) => {
        const token = `Bearer ${loginRes.body.data.token}`;
        chai
          .request(app)
          .get(url)
          .set('authorization', token)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('data');
            res.body.data[0].should.have.property('useremail');
            res.body.data[0].should.have.property('createdon');
            res.body.data[0].should.have.property('status');
            res.body.data[0].should.have.property('repaid');
            done();
          });
      });

  });

  it('Should throw an error if user is not an admin', (done) => {
    chai
      .request(app)
      .post(loginUrl)
      .send(correctUser)
      .end((loginErr, loginRes) => {
        const token = `Bearer ${loginRes.body.data.token}`;
        chai
          .request(app)
          .get(url)
          .set('authorization', token)
          .end((err, res) => {
            res.should.have.status(403);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.error.should.be.eql('Only Admin can access this route');
            done();
          });
      });
  });

  it('Should return a single loan application', (done) => {

    chai
      .request(app)
      .post(loginUrl)
      .send(myAdmin)
      .end((loginErr, loginRes) => {
        const token = `Bearer ${loginRes.body.data.token}`;
        chai
          .request(app)
          .get(`${url}/1`)
          .set('authorization', token)
          .end((err, res) => {
            console.log(res.body.error);
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('data');
            res.body.data[0].should.have.property('useremail');
            res.body.data[0].should.have.property('createdon');
            res.body.data[0].should.have.property('status');
            res.body.data[0].should.have.property('repaid');
            done();
          });
      });
  });

  it('Should throw an error if loan id does not exist', (done) => {
    chai
      .request(app)
      .post(loginUrl)
      .send(myAdmin)
      .end((loginErr, loginRes) => {
        const token = `Bearer ${loginRes.body.data.token}`;
        chai
          .request(app)
          .get(`${url}/10`)
          .set('authorization', token)
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.be.a('object');
            res.body.should.have.property('message');
            res.body.message.should.be.eql('No Loan with that id exist on database');
            done();

          });
      });
  });
});


// TEST TO VALIDATE FOR LOAN QUERY PARAMETERS
describe(`GET ${url}`, () => {
  it('Should return all loan applications that are approved and repaid', (done) => {
    chai
      .request(app)
      .post(loginUrl)
      .send(myAdmin)
      .end((loginErr, loginRes) => {
        const token = `Bearer ${loginRes.body.data.token}`;
        chai
          .request(app)
          .get(repaidUrl)
          .set('authorization', token)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('data');
            done();
          });
      });
  });
  it('Should return all loan applications that are approved and not repaid', (done) => {
    chai
      .request(app)
      .post(loginUrl)
      .send(myAdmin)
      .end((loginErr, loginRes) => {
        const token = `Bearer ${loginRes.body.data.token}`;
        chai
          .request(app)
          .get(unrepaidUrl)
          .set('authorization', token)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('data');
            done();
          });
      });
  });

  it('Should return error for wrong status word entered', (done) => {
    chai
      .request(app)
      .post(loginUrl)
      .send(myAdmin)
      .end((loginErr, loginRes) => {
        const token = `Bearer ${loginRes.body.data.token}`;
        chai
          .request(app)
          .get(wrongStatusUrl)
          .set('authorization', token)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.error.should.be.eql('Invalid status specified!');
            done();
          });
      });
  });

  it('Should return error for wrong repaid word entered', (done) => {
    chai
      .request(app)
      .post(loginUrl)
      .send(myAdmin)
      .end((loginErr, loginRes) => {
        const token = `Bearer ${loginRes.body.data.token}`;
        chai
          .request(app)
          .get(wrongRepaidUrl)
          .set('authorization', token)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.error.should.be.eql('Invalid repaid entered');
            done();
          });
      });
  });

  it('Should return error for wrong status type is entered', (done) => {
    chai
      .request(app)
      .post(loginUrl)
      .send(myAdmin)
      .end((loginErr, loginRes) => {
        const token = `Bearer ${loginRes.body.data.token}`;
        chai
          .request(app)
          .get(wrongStatusType)
          .set('authorization', token)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.error.should.be.eql('Invalid type of status entered!');
            done();
          });
      });
  });

  it('Should return error for wrong repaid type is entered', (done) => {
    chai
      .request(app)
      .post(loginUrl)
      .send(myAdmin)
      .end((loginErr, loginRes) => {
        const token = `Bearer ${loginRes.body.data.token}`;
        chai
          .request(app)
          .get(wrongRepaidType)
          .set('authorization', token)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.error.should.be.eql('Invalid type of repaid entered!');
            done();
          });
      });
  });
});

// TEST TO VALIDATE FOR ADMIN DECISION
describe(`PATCH ${url}`, () => {
  it('Should update loan status successfully', (done) => {
    chai
      .request(app)
      .post(loginUrl)
      .send(myAdmin)
      .end((loginErr, loginRes) => {
        const token = `Bearer ${loginRes.body.data.token}`;
        const decision = { status: 'approved' };
        chai
          .request(app)
          .patch(`${url}/${loanId}`)
          .set('authorization', token)
          .send(decision)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('data');
            done();
          });
      });
  });
});


describe(`PATCH ${url}`, () => {
  it('Should return error for wrong status type entered', (done) => {
    chai
      .request(app)
      .post(loginUrl)
      .send(myAdmin)
      .end((loginErr, loginRes) => {
        const token = `Bearer ${loginRes.body.data.token}`;
        const decision = { status: 'accept' };
        chai
          .request(app)
          .patch(`${url}/${loanId}`)
          .set('authorization', token)
          .send(decision)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.error.should.be.eql('Invalid status specified');
            done();
          });
      });
  });
  it('Should return error for invalid character entered for status', (done) => {
    chai
      .request(app)
      .post(loginUrl)
      .send(myAdmin)
      .end((loginErr, loginRes) => {
        const token = `Bearer ${loginRes.body.data.token}`;
        const decision = { status: 1 };
        chai
          .request(app)
          .patch(`${url}/${loanId}`)
          .set('authorization', token)
          .send(decision)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.error.should.be.eql('Invalid type of status Entered!');
            done();
          });
      });
  });
  it('Should return error for when status is not specified', (done) => {
    chai
      .request(app)
      .post(loginUrl)
      .send(myAdmin)
      .end((loginErr, loginRes) => {
        const token = `Bearer ${loginRes.body.data.token}`;
        chai
          .request(app)
          .patch(`${url}/${loanId}`)
          .set('authorization', token)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.error.should.be.eql('Status field is required!');
            done();
          });
      });
  });
  it('Should return error for invalid id type entered in the parameter', (done) => {
    chai
      .request(app)
      .post(loginUrl)
      .send(myAdmin)
      .end((loginErr, loginRes) => {
        const token = `Bearer ${loginRes.body.data.token}`;
        chai
          .request(app)
          .patch(`${url}/s`)
          .set('authorization', token)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.error.should.be.eql('Invalid type of id Entered!');
            done();
          });
      });
  });

  it('Should return error when id is not found', (done) => {
    chai
      .request(app)
      .post(loginUrl)
      .send(myAdmin)
      .end((loginErr, loginRes) => {
        const token = `Bearer ${loginRes.body.data.token}`;
        const decision = { status: 'approved' };
        chai
          .request(app)
          .patch(`${url}/10`)
          .set('authorization', token)
          .send(decision)
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.be.a('object');
            res.body.should.have.property('message');
            res.body.message.should.be.eql('No Loan with that id exist on database');
            done();
          });
      });
  });
  it('Should return error when token is not entered', (done) => {
    chai
      .request(app)
      .post(loginUrl)
      .send(myAdmin)
      .end((loginErr, loginRes) => {
        const token = `Bearer ${loginRes.body.data.token}`;
        const decision = { status: 'approved' };
        chai
          .request(app)
          .patch(`${url}/${loanId}`)
          .send(decision)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.error.should.be.eql('Invalid or No Token Provided');
            done();
          });
      });
  });
  it('Should return error when user that is not admin is trying to access route', (done) => {
    chai
      .request(app)
      .post(loginUrl)
      .send(correctUser)
      .end((loginErr, loginRes) => {
        const token = `Bearer ${loginRes.body.data.token}`;
        const decision = { status: 'approved' };
        chai
          .request(app)
          .patch(`${url}/${loanId}`)
          .set('authorization', token)
          .send(decision)
          .end((err, res) => {
            res.should.have.status(403);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            res.body.error.should.be.eql('Only Admin can access this route');
            done();
          });
      });
  });
  it('Should return error when loan is already approved', (done) => {
    chai
      .request(app)
      .post(loginUrl)
      .send(myAdmin)
      .end((loginErr, loginRes) => {
        const token = `Bearer ${loginRes.body.data.token}`;
        const decision = { status: 'approved' };
        chai
          .request(app)
          .patch('/api/v1/loans/1')
          .set('authorization', token)
          .send(decision)
          .end((err, res) => {
            res.should.have.status(409);
            res.body.should.be.a('object');
            res.body.should.have.property('message');
            res.body.message.should.be.eql('This loan has already been approved');
            done();
          });
      });
  });
});

describe(`POST ${url}`, () => {
  it('Should throw error if Tenor is less than 1', (done) => {
    chai
      .request(app)
      .post(loginUrl)
      .send(correctUser)
      .end((loginErr, loginRes) => {
        const token = `Bearer ${loginRes.body.data.token}`;
        chai
          .request(app)
          .post(url)
          .set('authorization', token)
          .send(insufficientTenor)
          .end((err, res) => {
            res.body.should.be.a('object');
            res.should.have.status(400);
            res.body.should.have.property('error');
            res.body.error.should.eql('Tenor must be between 1 and 12 months');
            done();
          });
      });
  });
});

describe(`POST ${url}`, () => {
  it('Should throw error if Tenor is greater than 12', (done) => {
    chai
      .request(app)
      .post(loginUrl)
      .send(correctUser)
      .end((loginErr, loginRes) => {
        const token = `Bearer ${loginRes.body.data.token}`;
        chai
          .request(app)
          .post(url)
          .set('authorization', token)
          .send(exceedTenor)
          .end((err, res) => {
            res.body.should.be.a('object');
            res.should.have.status(400);
            res.body.should.have.property('error');
            res.body.error.should.eql('Tenor must be between 1 and 12 months');
            done();
          });
      });
  });
});