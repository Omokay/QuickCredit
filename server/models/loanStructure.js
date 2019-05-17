const loans = [
  {
    id: 1,
    user: 'chuku.omoke@gmail.com',
    createdOn: new Date(),
    status: 'rejected',
    repaid: false,
    tenor: 12,
    amount: 500000,
    paymentInstallment: 0,
    balance: 500000.00,
    interest: 10000.00,
  },

  {
    id: 2,
    user: 'david.omoke@gmail.com',
    createdOn: '2019-05-17T15:53:08.716Z',
    status: 'approved',
    repaid: false,
    tenor: '10',
    amount: '50000',
    paymentInstallment: 50000250,
    balance: 50000,
    interest: 2500,
  },
];

export default loans;
