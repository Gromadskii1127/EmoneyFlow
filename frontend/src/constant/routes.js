export const adminRoutes = [
  {
    path: '/admin/transaction',
    icon: <span className='emicon-overview' />
  },
  {
    path: '/admin/company',
    icon: <span className='emicon-company' />
  },
  {
    path: '/admin/user',
    icon: <span className='emicon-payees' />
  }
];

export const userRoutes = [
  {
    path: '/user/dashboard',
    icon: <span className='emicon-home' />
  },
  {
    path: '/user/transaction',
    icon: <span className='emicon-overview' />
  },
  {
    path: '/user/add-payout',
    icon: <span className='emicon-payouts' />,
    subpaths: ['/user/new-payout/summary',
      '/user/new-payout/payout',
      '/user/new-payout/success',
      '/user/upload-payout/upload',      
      '/user/upload-payout/fields',
      '/user/upload-payout/review',
      '/user/upload-payout/summary',
      '/user/upload-payout/complete']
  },
  {
    path: '/user/payees',
    icon: <span className='emicon-user' />,
    subpaths: [
      '/user/upload-payee',
      '/user/add-payee',
      '/user/new-payee',
      '/user/new-payee/fields',
      '/user/upload-payee/upload',
      '/user/upload-payee/fields',
      '/user/upload-payee/summary',
      '/user/upload-payee/complete'
    ]
  }
];
