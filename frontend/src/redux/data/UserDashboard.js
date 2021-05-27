import subDays from "date-fns/subDays";

export const UserDashboardKpis = {
  lastTransactionSuccess: {
    amount: 5866,
    percentage: 0.76
  },
  lastTransactionPending: {
    amount: 5866,
    percentage: 0.76
  },
  lastTransactionError: {
    amount: 5866,
    percentage: 0.76
  },
  lastSevenDaysSuccess: {
    amount: 5866,
    percentage: 0.76
  },
  lastSevenDaysPending: {
    amount: 5866,
    percentage: 0.76
  },
  lastSevenDaysError: {
    amount: 5866,
    percentage: 0.76
  }
};

export const EmptyUserDashboardKpis = {
  lastTransactionSuccess: {},
  lastTransactionPending: {},
  lastTransactionError: {},
  lastSevenDaysSuccess: {},
  lastSevenDaysPending: {},
  lastSevenDaysError: {},
};

export const UserDashboardDebits = [{
  date: new Date().setDate(1),
  isFinished: true,
  total: 12341,
  payments: [{
    type: 'success',
    amount: 1235
  },{
    type: 'declined',
    amount: 1235
  }]
}, {
  date: new Date().setDate(4),
  isFinished: false,
  total: 12361
}]

export const EmptyUserDashboardDebits = []

export const UserDashboardBalance = {
  amount: 1135,
  iban: 'DE02 1234 5678 90 1234 5678 90'
}

export const EmptyUserDashboardBalance = [];

export const UserDashboardTopPayees = (count, filter) => { 
  const getCompare = (amount) => filter && filter.days && ({
    amount,
    start: subDays(new Date(), filter.days),
    end: new Date()
  });

  const getAmount = (value, hasIncreased) => {
    if (!filter || !filter.days) {
      return {value};
    }

    return {
      value: value*filter.days,
      hasIncreased
    }
  }

  const result = [{
    beneficiary: {
      id: '123456-AX',
      name: 'Sophie-Marie Pompadour',
      compare: getCompare(0.012)
    },
    amount: getAmount(850, true)
  },{
    beneficiary: {
      id: '123456-AX',
      name: 'Sophie-Marie Pompadour',
      compare: getCompare(-0.02)
    },
    amount: getAmount(700, false)
  },{
    beneficiary: {
      id: '123456-AX',
      name: 'Sophie-Marie Pompadour',
      compare: getCompare(0.35)
    },
    amount: getAmount(680, true)
  },{
    beneficiary: {
      id: '123456-AX',
      name: 'Sophie-Marie Pompadour',
      compare: getCompare(-0.2)
    },
    amount: getAmount(850, false)
  }];

  if (count) {
    return result.slice(0, count);
  }

  return result;
};

export const convertFetchedData = (currentDatas, prevDatas, days) =>{
  return currentDatas.map((payout, index) => {
    const total_amount = payout?.total_amount || 0;
    const filteredPrevList = prevDatas.filter((ppayout, index) => payout?.payeeId === ppayout?.payeeId && payout?.status === ppayout.status);
    let prevAmount = 0; let diff = 1;
    if (filteredPrevList.length > 0){
      prevAmount = filteredPrevList[0].total_amount;
    }
    if (prevAmount > 0 ) {
      diff = total_amount - prevAmount;
      diff = diff / prevAmount;
    }
    console.log('diff = ', diff);
    const beneficiary = {
      id: payout.payee.affiliateId,
      name: payout.payee.firstName + ' ' + payout.payee.lastName,
      compare: {
        amount: diff,
        start:subDays(new Date(), days * 2),
        end: subDays(new Date(), days),
      }
    }
    const amount = {
      value: total_amount,
      hasIncreased: diff > 0 ? true : false
    }
    return {
      beneficiary: beneficiary,
      amount: amount
    }
  })
}
export const EmptyUserDashboardTopPayees = [];

export const UserDashboardFees = (count, filter) => { 
  const getCount = (transactions, amount) => {
    if (!filter || !filter.days) {
      return {
        transactions: 1,
        amount
      }
    }

    return {
      transactions: transactions*filter.days,
      amount: amount*filter.days
    }
  }

  const result = [{
    payoutMethode: 'SEPA Express',
    ...getCount(10, 120)
  }, {
    payoutMethode: 'CC Europe',
    ...getCount(30, 320)
  }];

  if (count) {
    return result.slice(0, count);
  }

  return result;
}

export const EmptyUserDashboardFees = [];
