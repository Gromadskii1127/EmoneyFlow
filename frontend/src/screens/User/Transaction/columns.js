import { Tooltip } from '@material-ui/core';
import { stateValues } from 'constant';
import { EmoneyFormattedNumber } from 'components';
export const transactionListColumn = (intl) => {
  return [
    {
      title: intl.formatMessage({
        id: 'emoney.beneficiary',
        defaultMessage: 'BENEFICIARY'
      }),
      name: 'beneficiary',
      Cell: (row, column, value) => {
        return (
          <div>
            <div>
              {row?.payee?.firstName} {row?.payee?.lastName} {row?.payee?.email}{' '}
            </div>
          </div>
        );
      }
    },
    {
      title: intl.formatMessage({
        id: 'emoney.method',
        defaultMessage: 'METHOD'
      }),
      name: 'method',

      Cell: (row, column, value) => {
        return (
          <div>
            <div>
              {row?.payee?.method === 0
                ? intl.formatMessage({ id: 'method.SEPA' })
                : row?.payee?.method === 1
                  ? intl.formatMessage({ id: 'method.OCTARUSSIA' })
                  : row?.payee?.method === 2
                    ? intl.formatMessage({ id: 'method.CCUSA' })
                    : row?.payee?.method === 3
                      ? intl.formatMessage({ id: 'method.CCEUROPA' })
                      : row?.payee?.method === 4
                        ? intl.formatMessage({ id: 'method.CCPAGAFLEX' })
                        : row?.payee?.method === 5
                          ? intl.formatMessage({ id: 'method.COMXBANK' })
                          : row?.payee?.method === 6
                            ? intl.formatMessage({ id: 'method.MXPAGEFLEX' })
                            : ''}
            </div>
          </div>
        );
      }
    },
    {
      title: intl.formatMessage({
        id: 'admin.transaction.table.header.number',
        defaultMessage: 'NUMBER'
      }),
      name: 'number',
      Cell: (row, column, value) => {
        return (
          <div>
            <div>{row?.payee?.iban || ''}</div>
          </div>
        );
      }
    },
    {
      title: intl.formatMessage({
        id: 'emoney.amount.upper',
        defaultMessage: 'AMOUNT'
      }),
      name: 'amount',
      HeaderCell: (column) => {
        return (
          <div
            style={{
              textAlign: 'right',
              paddingTop: '5px',
              paddingRight: '15px',
              height: '30px'
            }}
          >
            <div style={{ padding: '0px', height: '14px' }}>{column.column.title}</div>
            <div className="trans-table-small-header">
              {intl.formatMessage({ id: 'emoney.fees' })}
            </div>
          </div>
        );
      },
      Cell: (row, column, value) => {
        return (
          <div className="trans-table-amount-container">
            <div>
              (<EmoneyFormattedNumber
                styleType={'currency'}
                currency={row?.payee?.currency || 'EUR'}
                number={row.amount || 0}
              />)

            </div>
            <div className="trans-table-td-small-body">
              ({row?.api?.amount})
            </div>
          </div>
        );
      }
    },
    {
      title: intl.formatMessage({
        id: 'emoney.status',
        defaultMessage: 'STATUS'
      }),
      name: 'state',
      Cell: (row, column, value) => {        
        const statusObj = stateValues[row.state || 'scheduled'];
        console.log('status object = ', row, statusObj)
        return (
          <Tooltip
            classes={{
              tooltip: 'trans-drawer-button-tooltip',
              arrow: 'trans-drawer-button-arrow'
            }}
            arrow
            title={intl.formatMessage({
              id: statusObj?.name || 'status.error',
              defaultMessage: statusObj?.default || 'ERROR'
            })}
            placement="top">
            <div
              className="trans-status"
              style={{ backgroundColor: statusObj?.color || '#EF394F' }}></div>
          </Tooltip>
        );
      }
    },
    {
      title: intl.formatMessage({
        id: 'emoney.date',
        defaultMessage: 'Date'
      }),
      name: 'date'
    }
  ];
};
