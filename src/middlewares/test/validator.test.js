import { 
    validateInputAccount,
    validateTransactionInput,
    validateInputAmount,
    validateRegistration,
    validateUpdateInput,
    validateLogin
  } from '../validator';
  
  const mockReq = (body = {}) => ({ body });
  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };
  const mockNext = jest.fn();
  
  describe('Validators', () => {
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('validateInputAccount', () => {
      it('should call next on valid input', () => {
        const req = mockReq({ bankName: "Bank", bankAccountNumber: "12345", balance: 1000, userId: 1 });
        const res = mockRes();
  
        validateInputAccount(req, res, mockNext);
        expect(mockNext).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
      });
  
      it('should return 400 on invalid input', () => {
        const req = mockReq({ bankName: "", balance: "invalid" });
        const res = mockRes();
  
        validateInputAccount(req, res, mockNext);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
        expect(mockNext).not.toHaveBeenCalled();
      });
    });
  
    describe('validateTransactionInput', () => {
      it('should call next on valid transaction', () => {
        const req = mockReq({ amount: 100, sourceId: 1, destinationId: 2 });
        const res = mockRes();
  
        validateTransactionInput(req, res, mockNext);
        expect(mockNext).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
      });
  
      it('should return 400 on invalid transaction input', () => {
        const req = mockReq({ amount: "invalid", sourceId: "NaN" });
        const res = mockRes();
  
        validateTransactionInput(req, res, mockNext);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
        expect(mockNext).not.toHaveBeenCalled();
      });
    });
  
    describe('validateInputAmount', () => {
      it('should call next on valid amount', () => {
        const req = mockReq({ amount: 100 });
        const res = mockRes();
  
        validateInputAmount(req, res, mockNext);
        expect(mockNext).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
      });
  
      it('should return 400 on invalid amount', () => {
        const req = mockReq({ amount: -100 });
        const res = mockRes();
  
        validateInputAmount(req, res, mockNext);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
        expect(mockNext).not.toHaveBeenCalled();
      });
    });
  
    describe('validateRegistration', () => {
      it('should call next on valid registration data', () => {
        const req = mockReq({ 
          name: "John Doe", 
          email: "john@example.com", 
          password: "secret123", 
          identityType: "Passport", 
          identityNumber: "A12345678", 
          address: "123 Main St" 
        });
        const res = mockRes();
  
        validateRegistration(req, res, mockNext);
        expect(mockNext).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
      });
  
      it('should return 400 on invalid registration data', () => {
        const req = mockReq({ email: "invalidEmail" });
        const res = mockRes();
  
        validateRegistration(req, res, mockNext);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
        expect(mockNext).not.toHaveBeenCalled();
      });
    });
  
    describe('validateUpdateInput', () => {
      it('should call next on valid update data', () => {
        const req = mockReq({ name: "Jane Doe", email: "jane@example.com" });
        const res = mockRes();
  
        validateUpdateInput(req, res, mockNext);
        expect(mockNext).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
      });
  
      it('should return 400 on invalid update data', () => {
        const req = mockReq({ email: "notAnEmail" });
        const res = mockRes();
  
        validateUpdateInput(req, res, mockNext);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
        expect(mockNext).not.toHaveBeenCalled();
      });
    });
  
    describe('validateLogin', () => {
      it('should call next on valid login data', () => {
        const req = mockReq({ email: "john@example.com", password: "secret123" });
        const res = mockRes();
  
        validateLogin(req, res, mockNext);
        expect(mockNext).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
      });
  
      it('should return 400 on invalid login data', () => {
        const req = mockReq({ email: "john@invalid" });
        const res = mockRes();
  
        validateLogin(req, res, mockNext);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
        expect(mockNext).not.toHaveBeenCalled();
      });
    });
  });
  