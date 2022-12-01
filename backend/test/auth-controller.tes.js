const User = require('../src/models/user');
const AuthController = require('../src/controllers/auth');
const mongoose = require('mongoose');

describe('authController - Login', () => {
  const req = {
    body: {
      email: 'test@test.com',
      password: 'tester',
    },
  };
  const res = {};
  const next = jest.fn();
  let user;

  beforeAll(() => {
    mongoose.connect('mongodb+srv://hyouka:leaf2201@cluster0.umlap.mongodb.net/test-messages?retryWrites=true&w=majority');
      user = new User({
      email: 'test@test.com',
      password: 'tester',
      name: 'test',
      posts: [],
      _id: '62e4f0538f2f5d99ba7a0dca',
    });
  });

  afterEach(() => {
    User.deleteMany({});
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    User.deleteMany({});
    await mongoose.disconnect();
  });

  it('should throw an error with code 500 if accessing the database fails', async () => {
    jest.spyOn(User, 'findOne').mockImplementation(() => {
      throw new Error('Database error');
    });

    const result = await AuthController.login(req, res, next);
    expect(result).toEqual(Error('Database error'));
    expect(result).toHaveProperty('statusCode', 500);
  });

  it('should send a response with a valid user status for an existing user ', async () => {
    await user.save();
    const req = {userId: '62e4f0538f2f5d99ba7a0dca'};
    const res = {
      statusCode: 500,
      userStatus: null,
      status: jest.fn().mockReturnValue(this.statusCode),
      json: jest.fn().mockReturnValue({}),
    };
    const next = jest.fn();
    AuthController.getUserStatus(req, res, next).then(() => {
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
