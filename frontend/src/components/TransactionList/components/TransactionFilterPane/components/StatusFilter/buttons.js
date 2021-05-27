import React from 'react';

const getButtons = (intl) => [
  {
    value: '',
    label: intl.formatMessage({
      id: 'emoney.all',
      defaultMessage: 'ALL'
    })
  },
  {
    value: 'paid',
    label: (
      <React.Fragment>
        <div
          className="status-icon"
          style={{ backgroundColor: '#5FDD35' }}></div>
        {intl.formatMessage({
          id: 'status.success',
          defaultMessage: 'SUCCESS'
        })}
      </React.Fragment>
    )
  },
  {
    value: 'pending',
    label: (
      <React.Fragment>
        <div
          className="status-icon"
          style={{ backgroundColor: '#FDC93D' }}></div>
        {intl.formatMessage({
          id: 'status.pending',
          defaultMessage: 'PENDING'
        })}
      </React.Fragment>
    )
  },
  {
    value: 'discarded',
    label: (
      <React.Fragment>
        <div
          className="status-icon"
          style={{ backgroundColor: '#8334D6' }}></div>
        {intl.formatMessage({
          id: 'status.declined',
          defaultMessage: 'DECLINED'
        })}
      </React.Fragment>
    )
  },
  {
    value: 'failed',
    label: (
      <React.Fragment>
        <div
          className="status-icon"
          style={{ backgroundColor: '#EF394F' }}></div>
        {intl.formatMessage({
          id: 'status.error',
          defaultMessage: 'ERROR'
        })}
      </React.Fragment>
    )
  }
];

export default getButtons;
