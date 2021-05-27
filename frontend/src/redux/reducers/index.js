import UserReducer from './UserReducer';
import DummyDataReducer from './DummyDataReducer';
import AdminTransactionReducer from './AdminTransactionReducer';
import AdminCompanyReducer from './AdminCompanyReducer';
import AdminUserReducer from './AdminUserReducer';
import UserDashboardReducer from './UserDashboardReducer';
import PayeeUploadCsvReducer from './PayeeUploadCsvReducer';
import PayoutUploadCsvReducer from './PayoutUploadCsvReducer';
import AddPayeeReducer from './AddPayeeReducer';
import AddPayoutReducer from './AddPayoutReducer';
import PayoutReducer from './PayoutReducer';
import PayeeReducer from './PayeeReducer';
import ErrorReducer from './ErrorReducer';
import UserTransactionReducer from './UserTransactionReducer';

export {
  UserReducer as user,  
  AdminTransactionReducer as transaction,
  AdminCompanyReducer as company,
  AdminUserReducer as adminUser,
  UserDashboardReducer as dashboard,
  PayeeUploadCsvReducer as payeeUploadCsv,
  PayoutUploadCsvReducer as payoutUploadCsv,
  AddPayeeReducer as addPayee,
  PayoutReducer as payout,
  PayeeReducer as payee,
  AddPayoutReducer as addPayout,
  UserTransactionReducer as userTransaction,
  ErrorReducer as errors,
  DummyDataReducer as dummy // Note: this is just for devs
};
