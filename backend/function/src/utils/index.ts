export { default as DBHelper } from './dbHelper';
export { default as Logger } from './logger';

export class ValidationError extends Error {
  constructor(message: any) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class DataNotfoundError extends Error {
  constructor(message: any) {
    super(message);
    this.name = 'DataNotfoundError';
  }
}

export class ForbiddenError extends Error {
  constructor(message: any) {
    super(message);
    this.name = 'ForbiddenError';
  }
}
