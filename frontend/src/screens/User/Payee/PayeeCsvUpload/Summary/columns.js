import { useCallback } from 'react';
const PayeeColumns = (intl) => {
  const convertMethod = useCallback((method) => {
    return method === 0 ? "method.SEPA" : 
    method === 1 ? "method.OCTARUSSIA" : 
    method === 2 ? "method.CCUSA" : 
    method === 3 ? "method.CCEUROPA" : 
    method === 4 ? "method.CCPAGAFLEX" : 
    method === 5 ? "method.COMXBANK" : 
    method === 6 ? "method.MXPAGEFLEX" : "method.SEPA"
  }, [])  
  return [
    {
      title: intl.formatMessage({
        id: 'emoney.affiliateId'
      }),
      name: 'affiliateId'
    },
    {
      title: intl.formatMessage({
        id: 'emoney.name'
      }),
      name: 'name',
      Cell: (row, column, value) => {
        const firstName = row['firstName'] ? row['firstName'] : '';
        const lastName = row['lastName'] ? row['lastName'] : '';
        return firstName + ' ' + lastName;
      }
    },
    
    {
      title: intl.formatMessage({
        id: 'emoney.method'
      }),
      name: 'paymentMethod',
      Cell: (row, _2, value) => {
        return intl.formatMessage({ id: convertMethod(row['method']) });
        
      }
    },
    {
      title: intl.formatMessage({
        id: 'emoney.iban'
      }),
      name: 'iban'
    },
    
  ];
};

export default PayeeColumns;
