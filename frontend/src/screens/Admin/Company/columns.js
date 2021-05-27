import _ from 'lodash';
import React, { useState } from 'react';
import {
  MenuList
} from '@material-ui/core';
import { DropdownMenuItem } from 'components/EmoneyMenu/components';
import { EmoneyFormattedNumberWithStatus, MorePopper } from 'components'
export const CompanyColumn = (
  intl,
  statusValues,
  handleViewEdit,
  handleDelete,
  theme
) => {
  return [
    {
      title: intl.formatMessage({
        id: 'admin.company.table.header.company',
        defaultMessage: 'COMPANY'
      }),
      name: 'name',
      width: '100px'
    },
    {
      title: intl.formatMessage({
        id: 'admin.company.table.header.contact-person',
        defaultMessage: 'CONTACT PERSON'
      }),
      name: 'contact-person',
      width: '200px',
      Cell: (row, column, value) => {
        return (
          <div>
            <div>
              {row['firstName']} {row['lastName']}
            </div>
            <div>{row['email']}</div>
          </div>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'method.SEPA', defaultMessage: 'SEPA' }),
      name: 'sepa',
      width: '70px',
      Cell: (row, column, value) => {
        const index = _.findIndex(row.apis, { apiType: 0 });
        const statusObj = statusValues[row.apis[index]?.status || 0];
        return (
          <EmoneyFormattedNumberWithStatus
            name={statusObj.name}
            color={statusObj.color}
            currency={row.apis[index]?.currency || 'EUR'}
            amount={row.apis[index]?.amount}>
          </EmoneyFormattedNumberWithStatus>
        );
      }
    },

    {
      title: intl.formatMessage({
        id: 'method.OCTARUSSIA',
        defaultMessage: 'OCTA RUSSIA'
      }),
      name: 'octa-russia',
      width: '70px',
      Cell: (row, column, value) => {
        const index = _.findIndex(row.apis, { apiType: 1 });
        const statusObj = statusValues[row.apis[index]?.status || 0];
        return (
          <EmoneyFormattedNumberWithStatus
            name={statusObj.name}
            color={statusObj.color}
            currency={row.apis[index]?.currency || 'EUR'}
            amount={row.apis[index]?.amount}>
          </EmoneyFormattedNumberWithStatus>
        );
      }
    },
    {
      title: intl.formatMessage({
        id: 'method.CCUSA',
        defaultMessage: 'CC USA'
      }),
      name: 'cc-usa',
      width: '70px',
      Cell: (row, column, value) => {
        const index = _.findIndex(row.apis, { apiType: 2 });
        const statusObj = statusValues[row.apis[index]?.status || 0];
        return (
          <EmoneyFormattedNumberWithStatus
            name={statusObj.name}
            color={statusObj.color}
            currency={row.apis[index]?.currency || 'EUR'}
            amount={row.apis[index]?.amount}>
          </EmoneyFormattedNumberWithStatus>
        );
      }
    },
    {
      title: intl.formatMessage({
        id: 'method.CCEUROPA',
        defaultMessage: 'CC EUROPA'
      }),
      name: 'cc-europa',
      width: '70px',
      Cell: (row, column, value) => {
        const index = _.findIndex(row.apis, { apiType: 3 });
        const statusObj = statusValues[row.apis[index]?.status || 0];
        return (
          <EmoneyFormattedNumberWithStatus
            name={statusObj.name}
            color={statusObj.color}
            currency={row.apis[index]?.currency || 'EUR'}
            amount={row.apis[index]?.amount}>
          </EmoneyFormattedNumberWithStatus>
        );
      }
    },
    {
      title: intl.formatMessage({
        id: 'method.MXPAGEFLEX',
        defaultMessage: 'MX PAGEFLEX'
      }),
      name: 'mx-pageflex',
      width: '70px',
      Cell: (row, column, value) => {
        const index = _.findIndex(row.apis, { apiType: 4 });
        const statusObj = statusValues[row.apis[index]?.status || 0];
        return (
          <EmoneyFormattedNumberWithStatus
            name={statusObj.name}
            color={statusObj.color}
            currency={row.apis[index]?.currency || 'EUR'}
            amount={row.apis[index]?.amount}>
          </EmoneyFormattedNumberWithStatus>
        );
      }
    },
    {
      title: '',
      name: '',
      shouldShow: false,
      width: '50px',
      Cell: (row, column) => {
        const [open, setOpen] = useState(false);
        return (
          <MorePopper onOpen={setOpen}>
            <MenuList
              autoFocusItem={open}
              id="row-menu-list-grow">
              <DropdownMenuItem
                onClick={event => handleViewEdit(row)}
                icon={'emicon-edit'}
                text={intl.formatMessage({
                  id: 'admin.company.table.header.detail.view',
                  defaultMessage: 'View / Edit'
                })}
              />
              <DropdownMenuItem
                onClick={event => handleDelete(row)}
                icon={'emicon-delete'}
                text={intl.formatMessage({
                  id: 'admin.company.table.header.detail.delete',
                  defaultMessage: 'Delete'
                })}
              />
            </MenuList>
          </MorePopper>
        );
      }
    }
  ];
};
