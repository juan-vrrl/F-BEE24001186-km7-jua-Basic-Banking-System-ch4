import errorHandler from '../errorHandler';
import AppError from '../../utils/AppError';

const mockReq = {};
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
const mockNext = jest.fn();

describe('errorHandler Middleware', () => {
  let res;

  beforeEach(() => {
    res = mockRes();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should handle AppError and send custom error response', () => {
    const customError = new AppError('Custom error message', 400);

    errorHandler(customError, mockReq, res, mockNext);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Custom error message' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('should handle non-AppError and send 500 response', () => {
    const genericError = new Error('Something went wrong');

    errorHandler(genericError, mockReq, res, mockNext);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Internal Server Error',
      sentry_id: null, 
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('should include sentry_id in response when available in generic error', () => {
    res.sentry = '12345';

    const genericError = new Error('Something went wrong');

    errorHandler(genericError, mockReq, res, mockNext);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Internal Server Error',
      sentry_id: '12345', 
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
