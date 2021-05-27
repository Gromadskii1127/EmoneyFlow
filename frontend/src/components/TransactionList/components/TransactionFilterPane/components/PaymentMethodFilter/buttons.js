const getButtons = (intl) => [
  {
    value: '-1',
    label: intl.formatMessage({
      id: 'emoney.all',
      defaultMessage: 'ALL'
    })
  },
  {
    value: '0',
    label: intl.formatMessage({
      id: 'method.SEPA',
      defaultMessage: 'SEPA'
    })
  },
  {
    value: '1',
    label: intl.formatMessage({
      id: 'method.OCTARUSSIA',
      defaultMessage: 'OCTA RUSSIA'
    })
  },
  {
    value: '2',
    label: intl.formatMessage({
      id: 'method.CCUSA',
      defaultMessage: 'CC USA'
    })
  },
  {
    value: '3',
    label: intl.formatMessage({
      id: 'method.CCEUROPA',
      defaultMessage: 'CC EUROPA'
    })
  },
  {
    value: '4',
    label: intl.formatMessage({
      id: 'method.CCPAGAFLEX',
      defaultMessage: 'CC PAGEFLEX'
    })
  },
  {
    value: '5',
    label: intl.formatMessage({
      id: 'method.COMXBANK',
      defaultMessage: 'CO/MX BANK TRANSFERS'
    })
  }
];

export default getButtons;
