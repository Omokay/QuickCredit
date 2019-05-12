import loans from '../models/loanStructure';

class adminHandler {
  static getSpecificLoan(req, res) {
    const { id } = req.params;

    const loanDetails = loans.find(loan => loan.id === parseInt(id, 10));

    // Check if the loan exist
    if (loanDetails) {
      return res.status(200).send({
        status: 200,
        loanDetails: [loanDetails],
      });
    }
    return res.status(404).send({
      status: 404,
      error: 'There is no loan',
    });
  }
}

module.exports = adminHandler;
