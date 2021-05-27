const getButtons = (intl) => [
  {
    value: '',
    label: intl.formatMessage({
      id: 'emoney.all',
      defaultMessage: 'ALL'
    })
  },
  {
    value: 'EUR',
    label: intl.formatMessage({
      id: 'currency.eur',
      defaultMessage: 'EUR'
    })
  },
  {
    value: 'USD',
    label: intl.formatMessage({
      id: 'currency.usd',
      defaultMessage: 'USD'
    })
  },
  {
    value: 'POUND',
    label: intl.formatMessage({
      id: 'currency.pound',
      defaultMessage: 'POUND'
    })
  }
];

export default getButtons;
