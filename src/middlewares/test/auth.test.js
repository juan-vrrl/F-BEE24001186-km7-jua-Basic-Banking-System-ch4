import jwt from 'jsonwebtoken';
import verifyToken from '../auth';
import AppError from '../../utils/AppError';

jest.mock('jsonwebtoken');

describe('verifyToken Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.spyOn(console, "error").mockImplementation(() => {}); // Mock console.error
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should respond with 401 if no token is provided', () => {
    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' });
    expect(next).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled(); // Expect no error to be logged
  });

  test('should respond with 401 if token is invalid', () => {
    req.headers.authorization = 'Bearer invalidToken';
    jwt.verify.mockImplementation(() => { throw new Error('Invalid token'); });

    verifyToken(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: 'Unauthorized: Invalid token', statusCode: 401 }));
    expect(res.status).not.toHaveBeenCalled();
    
    // Expect console.error to be called with the invalid token error
    expect(console.error).toHaveBeenCalledWith(
      expect.any(Error)
    );
  });

  test('should decode token and call next if token is valid', () => {
    const mockDecoded = { id: 1, email: 'test@example.com' };
    req.headers.authorization = 'Bearer validToken';
    jwt.verify.mockReturnValue(mockDecoded);

    verifyToken(req, res, next);

    expect(req.user).toEqual(mockDecoded);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled(); // Expect no error to be logged
  });
});
