import dotenv from 'dotenv';
import { describe, it } from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import jsonWebToken from 'jsonwebtoken';
import app from '../app';


chai.should();
chai.use(chaiHttp);
dotenv.config();
const { secretKey } = process.env;
const specificLoan = '/api/v1/loans/:id';
const user = {
  email: 'omoke@admin.com',
};
const token = jsonWebToken.sign(user, secretKey, { expiresIn: '8min'});
// Testing getting a specific loan data
describe('Admin get a specific loan application', () => {
  it('Should be able to get a specific loan data', (done) => {
    chai.request(app)
      .get(specificLoan)
      .set('Authorization', token)
      .end((err, res) => {
        res.should.have.status(401);
        res.should.be.an('object');
        res.body.should.have.property('error');
        done();
      });
  });

  it('Should not be able to get a loan application when there is none with the requested id', (done) => {
    chai.request(app)
      .get(specificLoan)
      .set('Authorization', token)
      .end((err, res) => {
        res.should.have.status(401);
        res.should.be.an('object');
        res.body.should.have.property('status');
        res.body.should.have.property('error');
        done();
      });
  });

  it('Should not be able to get a loan application when he/she is not authorized', (done) => {
    chai.request(app)
      .get(specificLoan)
      .end((err, res) => {
        res.should.have.status(401);
        res.should.be.an('object');
        res.body.should.have.property('status').eql(401);
        res.body.should.have.property('error');
        done();
      });
  });
});
