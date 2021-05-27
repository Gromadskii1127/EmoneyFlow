import React from 'react';
import _ from 'lodash';

const withMemo = Component =>
  React.memo(Component, (prev, next) => _.isEqual(prev, next));

export default withMemo;
