import {
  PaymentMethodSelect,
  CurrencySelect,
  AdormentTextField
} from 'components';
import { Email, Iban, Bic } from 'components/AdormentTextField/validators';


export const StaticFields = [{
  name: 'firstName',
  component: AdormentTextField,
  id: 'emoney.firstName:',
  required: true,
}, {
  name: 'lastName',
  component: AdormentTextField,
  id: 'emoney.lastName:',
  required: true,
}, {
  name: 'affiliateId',
  component: AdormentTextField,
  id: 'emoney.affiliateId:',
  required: true,
}, {
  name: 'email',
  component: (props) => (
    <AdormentTextField {...props} validator={Email} />
  ),
  id: 'emoney.eMail:.lowercase',
  required: true,
}, {
  name: 'addressLine1',
  component: (props) => (
    <AdormentTextField {...props}/>
  ),
  id: 'emoney.addressLine1:',
  required: true,
}
];

export const DynamicFields = {
  sepa: [
    {
      name: 'bankName',
      component: AdormentTextField,
      id: 'emoney.bankName:',
      required: true,
    },
    {
      name: 'iban',
      component: (props) => <AdormentTextField {...props} validator={Iban} />,
      id: 'emoney.iban:',
      required: true,
    },
    {
      name: 'bic',
      component: (props) => <AdormentTextField {...props} validator={Bic} />,
      id: 'emoney.bic:',
      required: true,
    },
    {
      name: 'currency',
      component: CurrencySelect,
      id: 'emoney.currency:',
      required: true,
    },
    {
      name: 'languageCode',
      component: AdormentTextField,
      id: 'emoney.languageCode:',
      required: true,
    }
    ,
    {
      name: 'countryCode',
      component: AdormentTextField,
      id: 'emoney.countryCode:',
      required: true,
    },
    {
      name: 'memo',
      component: AdormentTextField,
      id: 'emoney.memo:',
      required: true,
    }
  ]
};

export const PaymentMethodField = {
  name: 'method',
  component: PaymentMethodSelect,
  id: 'emoney.payment.method:',
  required: true,
};
