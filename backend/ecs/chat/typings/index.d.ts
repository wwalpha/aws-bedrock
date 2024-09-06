/// <reference path="../node_modules/aws-sdk-client-mock/dist/types/index.d.ts" />

import 'jest-extended';

export * from '../../types/index';
export * from './api';

declare module '*.json' {
  const value: any;
  export default value;
}
