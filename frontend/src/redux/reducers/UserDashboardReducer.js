import * as actionTypes from 'redux/actionTypes';
import { SUCCESS_SUFFIX, ERROR_SUFFIX } from 'constant';
import { extend, chain } from 'lodash';
import {
  EmptyUserDashboardKpis,
  EmptyUserDashboardDebits,
  EmptyUserDashboardBalance,
  EmptyUserDashboardTopPayees,
  EmptyUserDashboardFees,
  convertFetchedData
} from '../data/UserDashboard';

const initialState = {
  kpis: {
    isLoading: false,
    data: EmptyUserDashboardKpis
  },
  debits: {
    isLoading: false,
    data: EmptyUserDashboardDebits
  },
  balance: {
    isLoading: false,
    data: EmptyUserDashboardBalance
  },
  topPayees: {
    isLoading: false,
    data: EmptyUserDashboardTopPayees
  },
  fees: {
    isLoading: false,
    data: EmptyUserDashboardTopPayees
  }
};

const UserDashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.USER_DASHBOARD_GET_KPIS:
      return extend({}, state, {
        kpis: {
          isLoading: true,
          data: EmptyUserDashboardKpis
        }
      });
    case actionTypes.USER_DASHBOARD_GET_KPIS + SUCCESS_SUFFIX: {
      console.log('success = ')
      if (action.payload?.response?.status === 200) {
        return extend({}, state, {
          kpis: {
            isLoading: false,
            data: action.payload.data.body
          }
        });
      } else {
        console.log('success failed = ')
        return extend({}, state, {
          kpis: {
            isLoading: false,
            data: EmptyUserDashboardKpis
          }
        });
      }
    }
    case actionTypes.USER_DASHBOARD_GET_KPIS + ERROR_SUFFIX:
      return extend({}, state, {
        kpis: {
          isLoading: false,
          data: EmptyUserDashboardKpis
        }
      });
    case actionTypes.USER_DASHBOARD_GET_DEBITS:
      return extend({}, state, {
        debits: {
          isLoading: true,
          data: EmptyUserDashboardDebits
        }
      });
    case actionTypes.USER_DASHBOARD_GET_DEBITS + SUCCESS_SUFFIX: {
      if (action.payload?.response?.status === 200) {
        const datas = chain(action.payload.data.list)
          .groupBy('createdOn')
          .map((value, key) => ({ date: key, payments: value }))
          .value();
        return extend({}, state, {
          debits: {
            isLoading: false,
            data: datas
          }
        });
      } else {
        return extend({}, state, {
          debits: {
            isLoading: false,
            data: EmptyUserDashboardDebits
          }
        });
      }
    }

    case actionTypes.USER_DASHBOARD_GET_DEBITS + ERROR_SUFFIX:
      return extend({}, state, {
        debits: {
          isLoading: false,
          data: EmptyUserDashboardDebits
        }
      });
    case actionTypes.USER_DASHBOARD_GET_BALANCE:
      return extend({}, state, {
        balance: {
          isLoading: true,
          data: EmptyUserDashboardBalance
        }
      });
    case actionTypes.USER_DASHBOARD_GET_BALANCE + SUCCESS_SUFFIX:
      if (action.payload?.response?.status === 200) {
        return extend({}, state, {
          balance: {
            isLoading: false,
            data: action.payload.data.list
          }
        });
      } else {
        return extend({}, state, {
          balance: {
            isLoading: false,
            data: EmptyUserDashboardBalance
          }
        });
      }

    case actionTypes.USER_DASHBOARD_GET_BALANCE + ERROR_SUFFIX:
      return extend({}, state, {
        balance: {
          isLoading: false,
          data: EmptyUserDashboardBalance
        }
      });
    case actionTypes.USER_DASHBOARD_GET_TOP_PAYEES:
      return extend({}, state, {
        topPayees: {
          isLoading: true,
          data: EmptyUserDashboardTopPayees
        }
      });
    case actionTypes.USER_DASHBOARD_GET_TOP_PAYEES + SUCCESS_SUFFIX:
      if (action.payload.response?.status === 200) {
        const fetchedData = convertFetchedData(
          action.payload.data.list,
          action.payload.data.last,
          action.payload.data.days
        );
        return extend({}, state, {
          topPayees: {
            isLoading: false,
            data: fetchedData
          }
        });
      } else {
        return extend({}, state, {
          topPayees: {
            isLoading: false,
            data: EmptyUserDashboardFees
          }
        });
      }

    case actionTypes.USER_DASHBOARD_GET_TOP_PAYEES + ERROR_SUFFIX:
      return extend({}, state, {
        topPayees: {
          isLoading: false,
          data: EmptyUserDashboardTopPayees
        }
      });
    case actionTypes.USER_DASHBOARD_GET_FEES:
      return extend({}, state, {
        fees: {
          isLoading: true,
          data: EmptyUserDashboardFees
        }
      });
    case actionTypes.USER_DASHBOARD_GET_FEES + SUCCESS_SUFFIX:
      if (action.payload?.response?.status === 200) {
        return extend({}, state, {
          fees: {
            isLoading: false,
            data: action.payload.data.list
          }
        });
      } else {
        return extend({}, state, {
          fees: {
            isLoading: false,
            data: EmptyUserDashboardFees
          }
        });
      }

    case actionTypes.USER_DASHBOARD_GET_FEES + ERROR_SUFFIX:
      return extend({}, state, {
        fees: {
          isLoading: false,
          data: EmptyUserDashboardFees
        }
      });
    default: {
      return { ...state };
    }
  }
};

export default UserDashboardReducer;
