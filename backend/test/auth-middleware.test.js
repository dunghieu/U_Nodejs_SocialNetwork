const authMiddleware = require('../src/middleware/is-auth');
const jwt = require('jsonwebtoken');

describe.skip('authMiddleware', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should throw an error if no authorization header is present', async () => {
    const req = {
      get: jest.fn().mockReturnValue(null),
    };
    const res = {};
    const next = jest.fn();
    expect(() => authMiddleware(req, res, next)).toThrow(
      Error('Not authenticated.')
    );
  });

  it('should throw an error if the authorization header is only one string', () => {
    const req = {
      get: jest.fn().mockReturnValue('Bearer'),
    };
    const res = {};
    const next = jest.fn();
    expect(() => authMiddleware(req, res, next)).toThrow(Error);
  });

  it('should yielf the userId if the token is valid', () => {
    const req = {
      get: jest.fn().mockReturnValue('Bearer validtoken'),
    };
    const res = {};
    const next = jest.fn();
    jest.spyOn(jwt, 'verify').mockReturnValue({ userId: '123' });

    authMiddleware(req, res, next);
    expect(req).toHaveProperty('userId');
  });

  it('should throw an error if the token cannot be verified', () => {
    const req = {
      get: jest.fn().mockReturnValue('Bearer invalidtoken'),
    };
    const res = {};
    const next = jest.fn();
    expect(() => authMiddleware(req, res, next)).toThrow(Error);
  });
});
