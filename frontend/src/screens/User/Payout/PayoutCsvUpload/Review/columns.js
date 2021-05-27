
const ReviewColumns = (intl) => {
  
  return [
    {
      title: intl.formatMessage({
        id: 'emoney.beneficiary'
      }),
      name: 'beneficiary',
      Cell: (row, column, value) => {        
        console.log('row data ', row);
        return (
          <div>
            <div>{row['affiliateId']}</div>
            <div>
              {row['firstName']} {row['lastName']}
            </div>
            <div>{row['email']}</div>
          </div>
        );
      }
    },
    {
      title: intl.formatMessage({
        id: 'emoney.referenz'
      }),
      name: 'reference'
    },
    {
      title: intl.formatMessage({
        id: 'emoney.amount.upper'
      }),
      name: 'amount'
    },
    
  ];
};

export default ReviewColumns;
